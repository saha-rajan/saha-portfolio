import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { motion, useReducedMotion } from "motion/react";
import { AuraStateObject } from "./AuraStateObject";

// Shared DRACOLoader to prevent WebAssembly race conditions when multiple instances mount
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

// Global cursor tracker
const globalCursor = {
  x: 0,
  y: 0,
  isActive: false,
};

let isGlobalCursorInitialized = false;

function initGlobalCursor() {
  if (isGlobalCursorInitialized) return;
  if (typeof window === "undefined") return;
  isGlobalCursorInitialized = true;

  window.addEventListener("mousemove", (e) => {
    globalCursor.isActive = true;
    globalCursor.x = (e.clientX / window.innerWidth) * 2 - 1;
    globalCursor.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  document.addEventListener("mouseleave", () => {
    globalCursor.isActive = false;
  });
}

interface Aura3DEmotionObjectProps {
  modelUrl: string;
  fallbackSrc: string;
  alt: string;
  size?: number | string;
  className?: string;
  desiredScale?: number;
  idleDuration?: number;
  idleY?: number;
  idleRotate?: number;
  interactive?: boolean;
}

export function Aura3DEmotionObject({
  modelUrl,
  fallbackSrc,
  alt,
  size = "min(92px, 20vw)",
  className = "",
  desiredScale = 2.35,
  idleDuration = 12,
  idleY = 6,
  idleRotate = 5,
  interactive = true,
}: Aura3DEmotionObjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Initialize global cursor once per app lifecycle
  useEffect(() => {
    initGlobalCursor();
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setHasError(true);
      return;
    }

    if (!containerRef.current || !canvasRef.current) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let modelPivot: THREE.Group;
    let isComponentMounted = true;

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
      camera.position.set(0, 0, 3.8);
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      // Lights attached to camera so they remain fixed relative to the viewer when rotating
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      camera.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(5, 5, 5);
      camera.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xff6b50, 0.6);
      rimLight.position.set(-5, -2, -3);
      camera.add(rimLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
      topLight.position.set(0, 6, 2);
      camera.add(topLight);

      modelPivot = new THREE.Group();
      scene.add(modelPivot);

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load(
        modelUrl,
        (gltf) => {
          if (!isComponentMounted) return;

          const model = gltf.scene;

          const box = new THREE.Box3().setFromObject(model);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);

          const sizeVec = new THREE.Vector3();
          box.getSize(sizeVec);
          const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
          if (maxDim > 0) {
            const scale = desiredScale / maxDim;
            modelPivot.scale.set(scale, scale, scale);
          }

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.material) {
                (mesh.material as THREE.Material).needsUpdate = true;
              }
            }
          });

          modelPivot.add(model);
          setIsLoaded(true);
        },
        undefined,
        (error) => {
          console.warn("Error loading 3D GLB model:", error);
          if (isComponentMounted) {
            setHasError(true);
          }
        }
      );

      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width || 100;
        const height = rect.height || 100;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
      handleResize();
      
      const targetQuaternion = new THREE.Quaternion();
      const targetEuler = new THREE.Euler(0, 0, 0, "YXZ");

      // Positional Spring Physics State
      let currentX = 0;
      let currentY = 0;
      let velocityX = 0;
      let velocityY = 0;

      // Organic variation per model so they don't look perfectly synchronized
      const physics = {
        stiffness: 0.04 + Math.random() * 0.02, // How strongly it chases the target
        damping: 0.82 + Math.random() * 0.06,   // Underdamped (0.8-0.9) produces momentum/overshoot
        maxVelocity: 0.25, // Hard clamp to prevent excessive spinning
      };

      const animate = (time: number) => {
        animationFrameId = requestAnimationFrame(animate);

        if (modelPivot && !shouldReduceMotion) {
          let targetX = 0;
          let targetY = 0;

          // Target position is derived purely from cursor position
          if (globalCursor.isActive) {
            if (interactive) {
              targetY = globalCursor.x * Math.PI;
              targetX = -globalCursor.y * Math.PI; 
            } else {
              targetY = globalCursor.x * (Math.PI * 0.15); // limit to small left/right
              targetX = -globalCursor.y * (Math.PI * 0.10); // limit to small up/down
            }
          }

          // Calculate distance to target (spring force)
          const forceX = (targetX - currentX) * physics.stiffness;
          const forceY = (targetY - currentY) * physics.stiffness;

          // Apply force to velocity (acceleration)
          velocityX += forceX;
          velocityY += forceY;

          // Apply damping (friction)
          velocityX *= physics.damping;
          velocityY *= physics.damping;

          // Strict clamp on velocity to prevent wild spinning
          velocityX = THREE.MathUtils.clamp(velocityX, -physics.maxVelocity, physics.maxVelocity);
          velocityY = THREE.MathUtils.clamp(velocityY, -physics.maxVelocity, physics.maxVelocity);

          // Update actual physical position
          currentX += velocityX;
          currentY += velocityY;

          // Apply simulated position to rotation
          targetEuler.set(currentX, currentY, 0, "YXZ");
          targetQuaternion.setFromEuler(targetEuler);
          
          modelPivot.quaternion.copy(targetQuaternion);
        }

        renderer.render(scene, camera);
      };

      animate(performance.now());

      return () => {
        isComponentMounted = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (resizeObserver && containerRef.current) resizeObserver.unobserve(containerRef.current);
        if (renderer) renderer.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed:", e);
      setHasError(true);
    }
  }, [shouldReduceMotion, modelUrl, desiredScale, interactive]);

  if (hasError) {
    return (
      <AuraStateObject
        src={fallbackSrc}
        alt={alt}
        size={size}
        className={className}
        idleDuration={idleDuration}
        idleY={idleY}
        idleRotate={idleRotate}
      />
    );
  }

  const sizeStyle = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        width: sizeStyle,
        height: sizeStyle,
      }}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? { y: 0, rotate: 0 }
            : {
                y: [0, -idleY, 0],
                rotate: [0, idleRotate, -idleRotate, 0],
              }
        }
        transition={{
          duration: idleDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block transition-opacity duration-700 pointer-events-none"
          style={{
            opacity: isLoaded ? 1 : 0,
          }}
        />

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none">
            <AuraStateObject
              src={fallbackSrc}
              alt={alt}
              size="100%"
              idleDuration={idleDuration}
              idleY={idleY}
              idleRotate={idleRotate}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Aura3DEmotionObject;
