import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { RealisticAnimalId } from '../assets';

interface AnimalProps {
  readonly id: RealisticAnimalId;
  readonly position: readonly [number, number, number];
  readonly rotationY?: number;
  readonly phase?: number;
  readonly onTouch: (id: RealisticAnimalId) => void;
}

function Box({ p, s, c }: { p: [number, number, number]; s: [number, number, number]; c: string }) {
  return (
    <mesh position={p}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} flatShading />
    </mesh>
  );
}

function Sphere({ p, r, c }: { p: [number, number, number]; r: number; c: string }) {
  return (
    <mesh position={p}>
      <sphereGeometry args={[r, 8, 8]} />
      <meshStandardMaterial color={c} flatShading />
    </mesh>
  );
}

function Legs({ x, z, h, c }: { x: number; z: number; h: number; c: string }) {
  return (
    <>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => <Box key={`${sx}${sz}`} p={[sx * x, h / 2, sz * z]} s={[0.18, h, 0.18]} c={c} />),
      )}
    </>
  );
}

function Body({ id }: { id: RealisticAnimalId }) {
  switch (id) {
    case 'lion':
      return (
        <>
          <Legs x={0.25} z={0.5} h={0.5} c="#d9a441" />
          <Box p={[0, 0.8, 0]} s={[0.7, 0.55, 1.3]} c="#e0b050" />
          <Sphere p={[0, 1.15, -0.8]} r={0.5} c="#8a4b14" />
          <Sphere p={[0, 1.1, -0.95]} r={0.32} c="#e8c070" />
        </>
      );
    case 'elephant':
      return (
        <>
          <Legs x={0.4} z={0.7} h={0.9} c="#8d98a3" />
          <Box p={[0, 1.4, 0]} s={[1.2, 1, 1.9]} c="#9aa5b0" />
          <Sphere p={[0, 1.7, -1.2]} r={0.65} c="#9aa5b0" />
          <Box p={[0, 1.2, -1.85]} s={[0.22, 0.9, 0.22]} c="#8d98a3" />
          <Box p={[-0.7, 1.75, -1.2]} s={[0.1, 0.8, 0.8]} c="#a9b3bd" />
          <Box p={[0.7, 1.75, -1.2]} s={[0.1, 0.8, 0.8]} c="#a9b3bd" />
        </>
      );
    case 'giraffe':
      return (
        <>
          <Legs x={0.3} z={0.6} h={1.5} c="#e6b34a" />
          <Box p={[0, 1.9, 0]} s={[0.7, 0.7, 1.4]} c="#f0c25a" />
          <Box p={[0, 3, -0.6]} s={[0.25, 1.7, 0.25]} c="#f0c25a" />
          <Box p={[0, 3.95, -0.75]} s={[0.35, 0.3, 0.6]} c="#f0c25a" />
          <Box p={[0.1, 2.2, 0.2]} s={[0.72, 0.2, 0.2]} c="#8b5a1e" />
        </>
      );
    case 'monkey':
      return (
        <>
          <Box p={[0, 0.5, 0]} s={[0.5, 0.7, 0.4]} c="#7a4a26" />
          <Sphere p={[0, 1.05, 0]} r={0.28} c="#7a4a26" />
          <Sphere p={[0, 1, -0.2]} r={0.16} c="#e4c19a" />
          <Box p={[0, 0.3, 0.45]} s={[0.1, 0.1, 0.7]} c="#5e381b" />
          <Box p={[-0.4, 0.6, 0]} s={[0.12, 0.6, 0.12]} c="#7a4a26" />
          <Box p={[0.4, 0.6, 0]} s={[0.12, 0.6, 0.12]} c="#7a4a26" />
        </>
      );
    default:
      return (
        <>
          <Legs x={0.22} z={0.5} h={0.7} c="#f5f5f4" />
          <Box p={[0, 1.05, 0]} s={[0.6, 0.6, 1.3]} c="#fafaf9" />
          {[-0.4, -0.1, 0.2, 0.5].map((z) => (
            <Box key={z} p={[0, 1.06, z]} s={[0.63, 0.5, 0.1]} c="#1c1917" />
          ))}
          <Box p={[0, 1.45, -0.8]} s={[0.35, 0.6, 0.6]} c="#fafaf9" />
        </>
      );
  }
}

export function ProceduralAnimal({ id, position, rotationY = 0, phase = 0, onTouch }: AnimalProps) {
  const ref = useRef<Group>(null);
  const [hover, setHover] = useState(false);
  const bounce = useRef(0);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) {
      return;
    }
    bounce.current = Math.max(0, bounce.current - 0.04);
    const idle = Math.sin(clock.elapsedTime * 2 + phase) * 0.03;
    g.position.y = position[1] + idle + Math.sin(bounce.current * Math.PI) * 0.6;
    const target = hover || bounce.current > 0 ? 1.08 : 1;
    g.scale.setScalar(g.scale.x + (target - g.scale.x) * 0.2);
  });

  return (
    <group
      ref={ref}
      position={[position[0], position[1], position[2]]}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        bounce.current = 1;
        onTouch(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = '';
      }}
    >
      <Body id={id} />
    </group>
  );
}
