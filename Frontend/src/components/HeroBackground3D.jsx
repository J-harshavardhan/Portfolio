import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";

function DistortedSphere() {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.7}>
      <mesh ref={meshRef} scale={1.9} position={[0.15, -0.15, 0]}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#0f8b8d"
          transparent
          opacity={0.84}
          distort={0.34}
          speed={1.4}
          roughness={0.25}
          metalness={0.12}
        />
      </mesh>
    </Float>
  );
}

export default function HeroBackground3D() {
  return (
    <div className="hero-3d-shell" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <color attach="background" args={["#08111d"]} />
        <fog attach="fog" args={["#08111d", 5, 12]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 5, 3]} intensity={1.3} color="#9ff3f2" />
        <directionalLight position={[-4, -2, 2]} intensity={0.35} color="#12343a" />
        <Suspense fallback={null}>
          <DistortedSphere />
          <Sparkles count={34} speed={0.35} size={1.8} scale={[5, 3.5, 2]} color="#7ee9e7" />
        </Suspense>
      </Canvas>
    </div>
  );
}
