import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  MathUtils,
  Object3D,
  Points,
  Vector3,
} from 'three';
import type { RealisticAnimalId } from '../assets';
import { ProceduralJeep } from './ProceduralJeep';
import { ProceduralAnimal } from './ProceduralAnimals';

export const CHAPTER_COUNT = 5;
const STOPS: Vector3[] = Array.from(
  { length: CHAPTER_COUNT },
  (_, i) => new Vector3(Math.sin(i * 1.3) * 5, 0, -i * 22),
);
const CURVE = new CatmullRomCurve3(STOPS, false, 'catmullrom', 0.5);

export interface SceneProps {
  /** f = continuous chapter position in [0, CHAPTER_COUNT - 1] */
  readonly progressRef: { current: number };
  readonly onAnimalTouch: (id: RealisticAnimalId) => void;
  readonly onBalloonPop: () => void;
  readonly popRequest: number;
}

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Road() {
  const geometry = useMemo(() => {
    const steps = 160;
    const pos: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const p = CURVE.getPoint(t);
      const tan = CURVE.getTangent(t);
      const nx = -tan.z;
      const nz = tan.x;
      const len = Math.hypot(nx, nz) || 1;
      const w = 1.8;
      pos.push(p.x - (nx / len) * w, 0.02, p.z - (nz / len) * w, p.x + (nx / len) * w, 0.02, p.z + (nz / len) * w);
      if (i < steps) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#b98a52" side={2} />
    </mesh>
  );
}

function Trees() {
  const trunks = useRef<InstancedMesh>(null);
  const crowns = useRef<InstancedMesh>(null);
  const count = 70;
  const data = useMemo(() => {
    const rnd = seeded(42);
    const list: Array<{ x: number; z: number; s: number }> = [];
    while (list.length < count) {
      const t = rnd();
      const p = CURVE.getPoint(t);
      const side = rnd() > 0.5 ? 1 : -1;
      const dist = 6 + rnd() * 18;
      list.push({ x: p.x + side * dist, z: p.z + (rnd() - 0.5) * 10, s: 0.8 + rnd() * 1.1 });
    }
    return list;
  }, []);

  useLayoutEffect(() => {
    const o = new Object3D();
    data.forEach((d, i) => {
      o.position.set(d.x, d.s * 0.8, d.z);
      o.scale.set(d.s, d.s, d.s);
      o.updateMatrix();
      trunks.current?.setMatrixAt(i, o.matrix);
      o.position.set(d.x, d.s * 2.6, d.z);
      o.updateMatrix();
      crowns.current?.setMatrixAt(i, o.matrix);
    });
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
    if (crowns.current) crowns.current.instanceMatrix.needsUpdate = true;
  }, [data]);

  return (
    <>
      <instancedMesh ref={trunks} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.18, 0.25, 1.6, 6]} />
        <meshStandardMaterial color="#5b3a1e" flatShading />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, count]}>
        <coneGeometry args={[1.2, 3, 7]} />
        <meshStandardMaterial color="#2f7d3a" flatShading />
      </instancedMesh>
    </>
  );
}

function Fireflies({ target }: { target: { current: Group | null } }) {
  const ref = useRef<Points>(null);
  const grp = useRef<Group>(null);
  const geometry = useMemo(() => {
    const rnd = seeded(7);
    const arr: number[] = [];
    for (let i = 0; i < 80; i += 1) {
      arr.push((rnd() - 0.5) * 30, 0.5 + rnd() * 5, (rnd() - 0.5) * 30);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(arr, 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ clock }) => {
    if (grp.current && target.current) {
      grp.current.position.copy(target.current.position);
    }
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.03;
      ref.current.position.y = Math.sin(clock.elapsedTime) * 0.2;
    }
  });
  return (
    <group ref={grp}>
      <points ref={ref} geometry={geometry}>
        <pointsMaterial color="#fde047" size={0.14} transparent opacity={0.9} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
}

const BALLOON_COLORS = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
const BALLOON_COUNT = 10;

function Balloons({ onPop, popRequest }: { onPop: () => void; popRequest: number }) {
  const base = STOPS[CHAPTER_COUNT - 1];
  const [popped, setPopped] = useState<ReadonlySet<number>>(new Set());
  const refs = useRef<Array<Group | null>>([]);
  const lastRequest = useRef(popRequest);

  const items = useMemo(() => {
    const rnd = seeded(99);
    return Array.from({ length: BALLOON_COUNT }, (_, i) => ({
      x: base.x + (rnd() - 0.5) * 12,
      y: 2 + rnd() * 3,
      z: base.z - 3 - rnd() * 8,
      c: BALLOON_COLORS[i % BALLOON_COLORS.length],
      ph: rnd() * 6,
    }));
  }, [base]);

  const pop = (i: number) => {
    setPopped((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
    onPop();
  };

  useEffect(() => {
    if (popRequest !== lastRequest.current) {
      lastRequest.current = popRequest;
      const next = items.findIndex((_, i) => !popped.has(i));
      if (next >= 0) {
        setPopped((prev) => new Set(prev).add(next));
      }
    }
  }, [popRequest, items, popped]);

  useEffect(() => {
    if (popped.size >= BALLOON_COUNT) {
      const t = window.setTimeout(() => setPopped(new Set()), 1500);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [popped]);

  useFrame(({ clock }) => {
    items.forEach((b, i) => {
      const g = refs.current[i];
      if (g) {
        g.position.y = b.y + Math.sin(clock.elapsedTime + b.ph) * 0.3;
      }
    });
  });

  return (
    <>
      {items.map((b, i) =>
        popped.has(i) ? null : (
          <group
            key={i}
            ref={(g) => {
              refs.current[i] = g;
            }}
            position={[b.x, b.y, b.z]}
            onClick={(e) => {
              e.stopPropagation();
              pop(i);
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = '';
            }}
          >
            <mesh scale={[1, 1.2, 1]}>
              <sphereGeometry args={[0.55, 10, 10]} />
              <meshStandardMaterial color={b.c} flatShading roughness={0.4} />
            </mesh>
            <mesh position={[0, -1.4, 0]}>
              <boxGeometry args={[0.02, 1.6, 0.02]} />
              <meshBasicMaterial color="#f5f5f4" />
            </mesh>
          </group>
        ),
      )}
    </>
  );
}

function Rig({ progressRef, children }: { progressRef: { current: number }; children: (jeep: React.RefObject<Group | null>, spin: { current: number }) => React.ReactNode }) {
  const jeep = useRef<Group>(null);
  const spin = useRef(0);
  const smooth = useRef(0);
  const tmpPos = useMemo(() => new Vector3(), []);
  const camPos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame(({ camera }, delta) => {
    const g = jeep.current;
    if (!g) {
      return;
    }
    const target = progressRef.current / (CHAPTER_COUNT - 1);
    const prev = smooth.current;
    smooth.current = MathUtils.damp(prev, target, 4, delta);
    const u = MathUtils.clamp(smooth.current, 0, 1);
    CURVE.getPoint(u, tmpPos);
    const tan = CURVE.getTangent(u);
    g.position.copy(tmpPos);
    g.rotation.y = Math.atan2(-tan.x, -tan.z);
    spin.current -= (smooth.current - prev) * 900;

    camPos.copy(tmpPos).addScaledVector(tan, -8.5);
    camPos.y = 4.6;
    camera.position.lerp(camPos, 1 - Math.exp(-5 * delta));
    look.copy(tmpPos).addScaledVector(tan, 7);
    look.y = 1.2;
    camera.lookAt(look);
  });

  return (
    <>
      <group ref={jeep}>
        <ProceduralJeep spinRef={spin} />
      </group>
      {children(jeep, spin)}
    </>
  );
}

function World({ progressRef, onAnimalTouch, onBalloonPop, popRequest }: SceneProps) {
  const memoriesStop = STOPS[2];
  const animals: ReadonlyArray<{ id: RealisticAnimalId; o: readonly [number, number] }> = [
    { id: 'lion', o: [-4.5, -4] },
    { id: 'elephant', o: [6.5, -6] },
    { id: 'giraffe', o: [-8, -10] },
    { id: 'monkey', o: [4, -2] },
    { id: 'zebra', o: [9, -12] },
  ];
  return (
    <>
      <color attach="background" args={['#f9a65a']} />
      <fog attach="fog" args={['#f7b36b', 18, 70]} />
      <hemisphereLight args={['#ffd9a0', '#2f5d34', 0.9]} />
      <directionalLight color="#ffb35c" intensity={1.6} position={[-20, 12, 10]} />
      <mesh position={[0, -0.02, -44]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#4f8f3d" />
      </mesh>
      <mesh position={[-30, 14, -150]}>
        <sphereGeometry args={[9, 16, 16]} />
        <meshBasicMaterial color="#fff1b8" fog={false} />
      </mesh>
      <Road />
      <Trees />
      <Rig progressRef={progressRef}>{(jeep) => <Fireflies target={jeep} />}</Rig>
      {animals.map((a, i) => (
        <ProceduralAnimal
          key={a.id}
          id={a.id}
          phase={i}
          rotationY={a.o[0] < 0 ? -Math.PI / 2.5 : Math.PI / 2.5}
          position={[memoriesStop.x + a.o[0], 0, memoriesStop.z + a.o[1]]}
          onTouch={onAnimalTouch}
        />
      ))}
      <Balloons onPop={onBalloonPop} popRequest={popRequest} />
    </>
  );
}

export function Scene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 5, 10], fov: 55, near: 0.1, far: 120 }}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      style={{ touchAction: 'pan-y' }}
    >
      <World {...props} />
    </Canvas>
  );
}

export default Scene;
