import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

const WHEEL_POSITIONS: ReadonlyArray<readonly [number, number, number]> = [
  [-0.55, 0.3, 0.7],
  [0.55, 0.3, 0.7],
  [-0.55, 0.3, -0.7],
  [0.55, 0.3, -0.7],
];

/** Low-poly jeep built from primitives. Faces -Z (forward). */
export function ProceduralJeep({ spinRef }: { spinRef: { current: number } }) {
  const wheels = useRef<Array<Group | null>>([]);

  useFrame(() => {
    for (const wheel of wheels.current) {
      if (wheel) {
        wheel.rotation.x = spinRef.current;
      }
    }
  });

  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.1, 0.5, 2.2]} />
        <meshStandardMaterial color="#c2410c" flatShading />
      </mesh>
      <mesh position={[0, 0.95, 0.3]}>
        <boxGeometry args={[1, 0.4, 0.9]} />
        <meshStandardMaterial color="#9a3412" flatShading />
      </mesh>
      <mesh position={[0, 1.55, 0.5]}>
        <boxGeometry args={[1.15, 0.06, 1.3]} />
        <meshStandardMaterial color="#fde68a" flatShading />
      </mesh>
      {([-0.52, 0.52] as const).flatMap((x) =>
        ([-0.1, 1.05] as const).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.25, z]}>
            <boxGeometry args={[0.05, 0.6, 0.05]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
        )),
      )}
      {([-0.35, 0.35] as const).map((x) => (
        <mesh key={x} position={[x, 0.65, -1.12]}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {WHEEL_POSITIONS.map((pos, i) => (
        <group
          key={i}
          position={pos}
          ref={(g) => {
            wheels.current[i] = g;
          }}
        >
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.32, 0.32, 0.25, 10]} />
            <meshStandardMaterial color="#1c1917" flatShading />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.27, 6]} />
            <meshStandardMaterial color="#d6d3d1" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
