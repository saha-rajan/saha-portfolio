import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { MotionValue } from "motion/react";

// A LEAP-class high-bypass turbofan, modelled in Blender (one object per part, with its exploded
// offset, label and rotor speed stored as glTF extras) and shown in two looks:
//   real       PBR metals lit by a studio environment
//   technical  geometric wireframe over dark fills; everything that rotates is traced in orange

export type EngineLook = "real" | "technical";

const MODEL_URL = "/models/turbofan.glb";
const ORANGE = 0xffaa00;
// front to back, the order the scroll tour names the parts in
export const ENGINE_TOUR = ["spinner", "fan", "nacelle", "ogv", "booster", "hpc", "combustor", "hpt", "lpt", "trf", "exhaust", "corecowl", "lpshaft", "hpspool", "agb"];

const draco = new DRACOLoader();
draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

type PartMesh = {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  offset: THREE.Vector3;
  spin: number;
  part: string;
  real: THREE.Material | THREE.Material[];
  technical?: THREE.Group; // wireframe + outline, built in idle time after load
};
type Part = {
  key: string; label: string; meshes: PartMesh[];
  anchor: THREE.Vector3; offset: THREE.Vector3; // label point (top of the part) and how it moves when exploded
  center: THREE.Vector3; centerOffset: THREE.Vector3; radius: number; // what the camera closes in on during the tour
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Constant-width silhouette: back faces pushed out along their normals in screen space
function outlineMaterial(color: number, width: number) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    polygonOffset: true,
    polygonOffsetFactor: 4,
    polygonOffsetUnits: 4,
    uniforms: { uColor: { value: new THREE.Color(color) }, uWidth: { value: width }, uRes: { value: new THREE.Vector2(1, 1) } },
    vertexShader: /* glsl */ `
      uniform float uWidth; uniform vec2 uRes;
      void main() {
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vec2 dir = normalize((projectionMatrix * vec4(n, 0.0)).xy + 1e-6);
        clip.xy += dir * uWidth * clip.w / uRes;
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */ `uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 1.0); }`,
  });
}

export function JetEngine({ explode, look, interactive = false, tour, dolly, fitScale = 1, onReady }: {
  explode: MotionValue<number>; // 0 assembled → 1 exploded
  look: EngineLook;
  interactive?: boolean; // drag to orbit, hover to name a part
  tour?: MotionValue<number>; // 0 → 1 flies the camera to each part in turn (ENGINE_TOUR) and names it; outside 0–1 off
  dolly?: MotionValue<number>; // camera distance multiplier for the overview (below 1 pushes in)
  fitScale?: number; // the canvas is this much larger than the frame the overview should fill (room for close-ups)
  onReady?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const lookRef = useRef(look);
  lookRef.current = look;
  const applyLook = useRef<(l: EngineLook) => void>(() => {});

  useEffect(() => applyLook.current(look), [look]);

  useEffect(() => {
    const host = hostRef.current;
    const labelEl = labelRef.current;
    if (!host || !labelEl) return;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.domElement.style.display = "block";
    host.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 5, 4);
    const rim = new THREE.DirectionalLight(0xbcd2ff, 0.8);
    rim.position.set(6, 1, -5);
    scene.add(key, rim, new THREE.HemisphereLight(0xffffff, 0x202020, 0.5));

    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 100);
    const controls = interactive ? new OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 4;
      controls.maxDistance = 24;
      camera.position.set(-1.2, 2.4, 13.5); // side-on with a little lift, so the exploded parts line up
      controls.target.set(2.0, -0.3, 0);
    }

    const meshes: PartMesh[] = [];
    const parts = new Map<string, Part>();
    const outlines: THREE.ShaderMaterial[] = [];
    const fill = new THREE.MeshLambertMaterial({ color: 0x24262a, side: THREE.DoubleSide });
    // the wireframe keeps every edge where the surface turns by more than ~1° (rings and meridians of the
    // turned parts, airfoil sections of the blades) and skips the flat triangle diagonals
    const wireWhite = new THREE.LineBasicMaterial({ color: 0xdfe3ea, transparent: true, opacity: 0.32, depthWrite: false });
    const wireOrange = new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.55, depthWrite: false });

    let width = 1, height = 1;
    const buildTechnical = (p: PartMesh) => {
      if (p.technical) return;
      const g = new THREE.Group();
      const ol = outlineMaterial(p.spin ? ORANGE : 0xf0f0f0, 1.6);
      ol.uniforms.uRes.value.set(width / 2, height / 2);
      outlines.push(ol);
      g.add(new THREE.LineSegments(new THREE.EdgesGeometry(p.mesh.geometry, 1.2), p.spin ? wireOrange : wireWhite), new THREE.Mesh(p.mesh.geometry, ol));
      g.visible = lookRef.current === "technical";
      p.mesh.add(g);
      p.technical = g;
    };

    applyLook.current = (l: EngineLook) => {
      scene.environment = l === "real" ? envMap : null;
      key.intensity = l === "real" ? 1.6 : 2.2;
      for (const p of meshes) {
        if (l === "technical") buildTechnical(p);
        p.mesh.material = l === "real" ? p.real : fill;
        if (p.technical) p.technical.visible = l === "technical";
      }
    };

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.load(MODEL_URL, (gltf) => {
      if (disposed) return;
      gltf.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const x = mesh.userData;
        const pm: PartMesh = {
          mesh, base: mesh.position.clone(), offset: new THREE.Vector3(x.ex ?? 0, x.ey ?? 0, 0), spin: x.spin ?? 0,
          part: x.part ?? mesh.name, real: mesh.material,
        };
        meshes.push(pm);
        const part = parts.get(pm.part) ?? {
          key: pm.part, label: x.label ?? pm.part, meshes: [], anchor: new THREE.Vector3(), offset: pm.offset.clone(),
          center: new THREE.Vector3(), centerOffset: new THREE.Vector3(), radius: 1,
        };
        part.meshes.push(pm);
        parts.set(pm.part, part);
      });
      // label anchor: top centre of the part (for split casings, the upper half, which travels up)
      const box = new THREE.Box3();
      for (const part of parts.values()) {
        const upper = part.meshes.filter((m) => m.offset.y > 0);
        const use = upper.length ? upper : part.meshes;
        box.makeEmpty();
        for (const m of use) {
          m.mesh.geometry.computeBoundingBox();
          box.union(m.mesh.geometry.boundingBox!.clone().translate(m.base));
        }
        part.anchor.set((box.min.x + box.max.x) / 2, box.max.y, 0);
        part.offset.copy(use[0].offset);
        // the whole part (both halves of a split casing) for the camera
        box.makeEmpty();
        part.centerOffset.set(0, 0, 0);
        for (const m of part.meshes) {
          box.union(m.mesh.geometry.boundingBox!.clone().translate(m.base));
          part.centerOffset.addScaledVector(m.offset, 1 / part.meshes.length);
        }
        box.getCenter(part.center);
        part.radius = box.getSize(new THREE.Vector3()).length() / 2;
      }
      scene.add(gltf.scene);
      applyLook.current(lookRef.current);
      onReady?.();
      // prepare the technical look in idle time so switching to it is instant
      const queue = [...meshes];
      const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
      const idle = (cb: () => void) => (w.requestIdleCallback ? w.requestIdleCallback(cb) : window.setTimeout(cb, 60));
      const step = () => {
        if (disposed || !queue.length) return;
        buildTechnical(queue.shift()!);
        idle(step);
      };
      idle(step);
    });

    // framing: the assembled engine from the front quarter, widening to the exploded spread seen
    // side-on, so every module lines up along the axis like a technical drawing
    const target = new THREE.Vector3();
    const view = (e: number, aspect: number) => {
      const halfW = THREE.MathUtils.lerp(3.1, 3.8, e), halfH = THREE.MathUtils.lerp(1.9, 3.0, e);
      const vt = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max(halfH / vt, halfW / (vt * aspect)) * 1.1;
      target.set(THREE.MathUtils.lerp(1.75, 2.0, e), THREE.MathUtils.lerp(0, -0.3, e), 0);
      return { dist, angle: THREE.MathUtils.lerp(-1.12, -0.18, e), lift: THREE.MathUtils.lerp(0.26, 0.16, e) };
    };

    const resize = () => {
      width = host.clientWidth || 1;
      height = host.clientHeight || 1;
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      for (const o of outlines) o.uniforms.uRes.value.set(width / 2, height / 2);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // hover (interactive): name the part under the pointer
    let hovered: string | null = null;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onMove = (ev: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      pointer.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes.map((m) => m.mesh), false)[0];
      hovered = hit ? ((hit.object.userData.part as string) ?? null) : null;
    };
    const onLeave = () => (hovered = null);
    if (interactive) {
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerleave", onLeave);
    }

    // only render while on screen
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
    io.observe(host);

    // tour state: where along the parts the camera is, and how far into the tour (eases in and out)
    const N = ENGINE_TOUR.length;
    const tourState = () => {
      const t = tour ? tour.get() : -1;
      if (interactive || t < 0 || t > 1) return null;
      const f = Math.min(N - 1, Math.max(0, t * N - 0.5));
      const i0 = Math.floor(f), i1 = Math.min(N - 1, i0 + 1);
      const w = smooth(clamp01((f - i0 - 0.3) / 0.4)); // hold on each part, then glide to the next
      const amount = smooth(clamp01(Math.min(t, 1 - t) / 0.06));
      return { i0, i1, w, amount, shown: w < 0.5 ? i0 : i1 };
    };
    const camTarget = new THREE.Vector3(), c0 = new THREE.Vector3(), c1 = new THREE.Vector3();

    const labelText = labelEl.querySelector("[data-text]") as HTMLElement;
    const labelCount = labelEl.querySelector("[data-count]") as HTMLElement;
    const v = new THREE.Vector3();
    let shownKey: string | null = null;
    const showLabel = (e: number, ts: ReturnType<typeof tourState>) => {
      let keyName: string | null = interactive ? hovered : null;
      let count = "";
      if (ts && ts.amount > 0.5 && e > 0.9) {
        keyName = ENGINE_TOUR[ts.shown];
        count = `${String(ts.shown + 1).padStart(2, "0")} / ${N}`;
      }
      const part = keyName ? parts.get(keyName) : undefined;
      if (!part) {
        labelEl.style.opacity = "0";
        shownKey = null;
        return;
      }
      if (shownKey !== part.key) {
        labelText.textContent = part.label;
        labelCount.textContent = count;
        shownKey = part.key;
      }
      v.copy(part.anchor).addScaledVector(part.offset, e).project(camera);
      labelEl.style.opacity = "1";
      // keep the tag inside the canvas's visible middle (the edges fade out)
      const lx = Math.min(width * 0.82, Math.max(width * 0.18, (v.x * 0.5 + 0.5) * width));
      const ly = Math.min(height * 0.85, Math.max(height * 0.22, (-v.y * 0.5 + 0.5) * height));
      labelEl.style.transform = `translate(${lx}px, ${ly}px)`;
    };

    const clock = new THREE.Clock();
    let orbit = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!visible) return;
      const e = smooth(clamp01(explode.get()));
      for (const p of meshes) {
        p.mesh.position.copy(p.base).addScaledVector(p.offset, e);
        if (p.spin) p.mesh.rotation.x += p.spin * dt * 0.9;
      }
      const ts = tourState();
      if (controls) controls.update();
      else {
        orbit += dt * 0.08;
        const vw = view(e, camera.aspect);
        let dist = vw.dist * fitScale * (dolly ? dolly.get() : 1);
        let a = vw.angle + Math.sin(orbit) * 0.12 * (1 - e * 0.6); // a slow drift so it never looks frozen
        let lift = vw.lift;
        camTarget.copy(target);
        if (ts && ts.amount > 0) {
          // close in on the part being explained, gliding from one part to the next
          const p0 = parts.get(ENGINE_TOUR[ts.i0]), p1 = parts.get(ENGINE_TOUR[ts.i1]);
          if (p0 && p1) {
            c0.copy(p0.center).addScaledVector(p0.centerOffset, e);
            c1.copy(p1.center).addScaledVector(p1.centerOffset, e);
            c0.lerp(c1, ts.w);
            const fd = Math.max(3.4, THREE.MathUtils.lerp(p0.radius, p1.radius, ts.w) * 3.4);
            const fa = -0.42 + 0.22 * Math.sin(THREE.MathUtils.lerp(ts.i0, ts.i1, ts.w) * 1.3);
            camTarget.lerp(c0, ts.amount);
            dist = Math.exp(THREE.MathUtils.lerp(Math.log(dist), Math.log(fd), ts.amount));
            a = THREE.MathUtils.lerp(a, fa, ts.amount);
            lift = THREE.MathUtils.lerp(lift, 0.22, ts.amount);
          }
        }
        camera.position.set(camTarget.x + Math.sin(a) * Math.cos(lift) * dist, camTarget.y + Math.sin(lift) * dist,
          camTarget.z + Math.cos(a) * Math.cos(lift) * dist);
        camera.lookAt(camTarget);
      }
      camera.updateMatrixWorld();
      showLabel(e, ts);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      controls?.dispose();
      envMap.dispose();
      pmrem.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  return (
    <div ref={hostRef} className="absolute inset-0" style={interactive ? { cursor: "grab", touchAction: "none" } : undefined}>
      {/* part label: a leader line up from the part to its name */}
      <div ref={labelRef} className="absolute left-0 top-0 pointer-events-none transition-opacity duration-200" style={{ opacity: 0 }}>
        <div className="absolute left-0 bottom-0 flex flex-col items-center -translate-x-1/2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          <div className="px-2.5 py-1 rounded-full bg-black/80 border border-[#ffaa00]/60 backdrop-blur-sm whitespace-nowrap flex items-center gap-2">
            <span data-count className="text-[#ffaa00] text-[9px] tracking-[0.15em] empty:hidden" />
            <span data-text className="text-white text-[10px] md:text-[11px] tracking-[0.08em]" />
          </div>
          <div className="w-px h-7 bg-[#ffaa00]/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#ffaa00] -mb-[3px]" />
        </div>
      </div>
    </div>
  );
}
