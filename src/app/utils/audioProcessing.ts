export class AudioStreamer {
  public isMuted: boolean = false;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
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
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    
    // Use ScriptProcessor (deprecated but works reliably in most browsers for simple 16kHz PCM capture without an external worklet file)
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    this.processor.onaudioprocess = (e) => {
      const float32Audio = e.inputBuffer.getChannelData(0);
      
      // Convert Float32 to Int16
      const int16Audio = new Int16Array(float32Audio.length);
      for (let i = 0; i < float32Audio.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Audio[i]));
        int16Audio[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      
      // Convert to Base64
      let binary = '';
      const bytes = new Uint8Array(int16Audio.buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      if (!this.isMuted) this.onAudioData(btoa(binary));
    };
    
    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }
  
  stop() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
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
  private audioContext: AudioContext;
  private nextPlayTime: number = 0;
  private currentSources: AudioBufferSourceNode[] = [];
  
  constructor() {
    this.audioContext = new AudioContext({ sampleRate: 24000 });
  }
  
  getAudioContextState() { return this.audioContext?.state; }
  async resume() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
  
  play(base64Audio: string) {
    // Gemini returns 24kHz PCM for Live API
    const binaryStr = atob(base64Audio);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    // Int16 to Float32
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 0x7FFF;
    }
    
    const buffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
    buffer.getChannelData(0).set(float32Array);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    
    // Queue sequentially
    const currentTime = this.audioContext.currentTime;
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime;
    }
    
    source.start(this.nextPlayTime);
    this.nextPlayTime += buffer.duration;
    
    this.currentSources.push(source);
    source.onended = () => {
      this.currentSources = this.currentSources.filter(s => s !== source);
    };
  }
  
  interrupt() {
    this.currentSources.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    this.currentSources = [];
    this.nextPlayTime = this.audioContext.currentTime;
  }
}
