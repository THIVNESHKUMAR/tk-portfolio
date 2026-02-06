import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, Text } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";

export default function ProjectsCarousel3D({ projects }) {
  return (
    <div
      style={{
        height: "min(72vh, 720px)",
        borderRadius: 22,
        overflow: "hidden",
      }}
    >
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 8.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} />
        <Environment preset="city" />
        <Carousel projects={projects} />
      </Canvas>
    </div>
  );
}

function Carousel({ projects }) {
  const group = useRef();
  const velocity = useRef(0);
  const rot = useRef(0);

  const cards = useMemo(() => {
    const radius = 4.6;
    return projects.map((p, i) => {
      const angle = (i / projects.length) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      return { ...p, angle, pos: [x, 0, z] };
    });
  }, [projects]);

  const bind = useDrag(({ delta: [dx], last }) => {
    velocity.current = -dx * 0.0022;
    if (last) {
      // keep inertia
      velocity.current *= 1.15;
    }
  });

  useFrame((_, dt) => {
    // inertia + damping
    rot.current += velocity.current;
    velocity.current = THREE.MathUtils.damp(velocity.current, 0, 6, dt);
    if (group.current) group.current.rotation.y = rot.current;
  });

  return (
    <group ref={group} {...bind()} rotation={[0, 0, 0]}>
      {cards.map((p, i) => (
        <ProjectCard key={p.title + i} project={p} index={i} />
      ))}
    </group>
  );
}

function ProjectCard({ project, index }) {
  const ref = useRef();

  // Face the camera-ish by rotating opposite of its angle
  const r = Math.atan2(project.pos[0], project.pos[2]);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    // subtle hover-ish breathing
    ref.current.position.y = Math.sin(performance.now() * 0.001 + index) * 0.06;

    // make text readable: align a bit toward camera
    ref.current.lookAt(camera.position.x, camera.position.y, camera.position.z);
  });

  const open = () => {
    if (project.href && project.href !== "#")
      window.open(project.href, "_blank", "noreferrer");
  };

  return (
    <group ref={ref} position={project.pos} rotation={[0, r, 0]} onClick={open}>
      <RoundedBox args={[3.2, 1.9, 0.22]} radius={0.18} smoothness={6}>
        <meshStandardMaterial
          metalness={0.7}
          roughness={0.18}
          color={"#0d1220"}
          emissive={"#1d2a55"}
          emissiveIntensity={0.35}
        />
      </RoundedBox>

      <Text
        position={[0, 0.45, 0.13]}
        fontSize={0.23}
        maxWidth={2.8}
        anchorX="center"
        anchorY="middle"
        color="rgba(255,255,255,0.92)"
      >
        {project.title}
      </Text>

      <Text
        position={[0, 0.08, 0.13]}
        fontSize={0.16}
        maxWidth={2.8}
        anchorX="center"
        anchorY="middle"
        color="rgba(255,255,255,0.72)"
      >
        {project.tag}
      </Text>

      <Text
        position={[0, -0.32, 0.13]}
        fontSize={0.14}
        maxWidth={2.7}
        anchorX="center"
        anchorY="middle"
        color="rgba(255,255,255,0.62)"
      >
        {project.desc}
      </Text>
    </group>
  );
}
