// base64 <-> bytes in 32 KB slices: far faster than one String.fromCharCode per byte
function bytesToBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000) as unknown as number[]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// Mic capture runs on the audio thread (AudioWorklet), so a busy page (scroll animations, 3D) can't
// delay or drop it. It converts to 16-bit PCM there and posts 100 ms chunks back.
const CAPTURE_WORKLET = `
class PcmCapture extends AudioWorkletProcessor {
  constructor() { super(); this.size = 1600; this.buf = new Int16Array(this.size); this.n = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) {
        const s = Math.max(-1, Math.min(1, ch[i]));
        this.buf[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
        if (this.n === this.size) {
          this.port.postMessage(this.buf.buffer, [this.buf.buffer]);
          this.buf = new Int16Array(this.size);
          this.n = 0;
        }
      }
    }
    return true;
  }
}
registerProcessor('pcm-capture', PcmCapture);
`;

export class AudioStreamer {
  public isMuted: boolean = false;
  private audioContext: AudioContext | null = null;
  private node: AudioNode | null = null;
  private mediaStream: MediaStream | null = null;

  constructor(public onAudioData: (base64: string) => void) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioCtx({ sampleRate: 16000 });
  }

  async start() {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true
      }
    });

    const ctx = this.audioContext!;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const source = ctx.createMediaStreamSource(this.mediaStream);
    const send = (pcm: ArrayBuffer) => {
      if (!this.isMuted) this.onAudioData(bytesToBase64(new Uint8Array(pcm)));
    };

    try {
      const url = URL.createObjectURL(new Blob([CAPTURE_WORKLET], { type: 'application/javascript' }));
      await ctx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);
      const worklet = new AudioWorkletNode(ctx, 'pcm-capture', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1 });
      worklet.port.onmessage = (e) => send(e.data as ArrayBuffer);
      this.node = worklet;
    } catch {
      // Older browsers without AudioWorklet: ScriptProcessor on the main thread, same 16-bit PCM
      const processor = ctx.createScriptProcessor(2048, 1, 1);
      processor.onaudioprocess = (e) => {
        const f32 = e.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
          const s = Math.max(-1, Math.min(1, f32[i]));
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        send(pcm.buffer);
      };
      this.node = processor;
    }

    source.connect(this.node);
    this.node.connect(ctx.destination); // keeps the node pulled; it outputs silence
  }

  stop() {
    if (this.node) {
      this.node.disconnect();
      if (this.node instanceof AudioWorkletNode) this.node.port.onmessage = null;
      this.node = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class AudioPlayer {
  // Audio kept queued before a reply starts playing, so chunks that arrive a little late
  // (normal network jitter) join seamlessly instead of leaving gaps
  private static readonly CUSHION = 0.15;
  private audioContext: AudioContext;
  private output: GainNode;
  private nextPlayTime: number = 0;
  private currentSources: AudioBufferSourceNode[] = [];
  public onPlaybackComplete?: () => void;

  constructor() {
    this.audioContext = new AudioContext({ sampleRate: 24000 });
    this.output = this.audioContext.createGain();
    this.output.connect(this.audioContext.destination);
  }

  getAudioContextState() { return this.audioContext?.state; }
  async resume() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  play(base64Audio: string) {
    // Gemini Live returns 16-bit PCM at 24 kHz
    const bytes = base64ToBytes(base64Audio);
    const int16 = new Int16Array(bytes.buffer, 0, bytes.byteLength >> 1);
    const buffer = this.audioContext.createBuffer(1, int16.length, 24000);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < int16.length; i++) channel[i] = int16[i] / 0x8000;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.output);

    // Back-to-back scheduling. If the queue has run dry (a new reply, or a chunk arrived late),
    // restart a short cushion ahead instead of playing the instant it lands
    const now = this.audioContext.currentTime;
    if (this.nextPlayTime < now + 0.02) {
      this.nextPlayTime = now + AudioPlayer.CUSHION;
    }
    source.start(this.nextPlayTime);
    this.nextPlayTime += buffer.duration;

    this.currentSources.push(source);
    source.onended = () => {
      this.currentSources = this.currentSources.filter(s => s !== source);
      if (this.currentSources.length === 0) {
        setTimeout(() => {
          if (this.currentSources.length === 0 && this.onPlaybackComplete) {
            this.onPlaybackComplete();
          }
        }, 300);
      }
    };
  }

  interrupt() {
    // fade out over a few milliseconds rather than cutting mid-wave (avoids a click)
    const now = this.audioContext.currentTime;
    const gain = this.output.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(0, now + 0.04);
    const sources = this.currentSources;
    this.currentSources = [];
    sources.forEach(source => {
      source.onended = null;
      try { source.stop(now + 0.045); } catch (e) {}
    });
    gain.setValueAtTime(1, now + 0.05);
    this.nextPlayTime = now + 0.05;
    if (this.onPlaybackComplete) this.onPlaybackComplete();
  }
}
