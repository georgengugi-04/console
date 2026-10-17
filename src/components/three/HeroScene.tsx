"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Theme } from "@/lib/theme";
import { SCENE_PALETTES, type ScenePalette } from "./scenePalette";

/**
 * CONSOLE hero scene — an abstract protection concept.
 *   • a sculpted open shield (extruded, bevelled, forest-metal) crossed by a luminous swoosh (the brand mark, in 3D)
 *   • a ring of slender pillars that rises around it — a protective boundary / architecture
 *   • four small objects orbiting the boundary: house, vehicle, person, health cross
 * Rendering budget: ≤ 1 draw call per pillar group (instanced), no postprocessing pass, procedural reflections
 * (no HDR download), environment baked once, DPR capped, loop paused off-screen.
 */

const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);

/* ── helpers ─────────────────────────────────────────────────── */
function shieldShape(scale = 1, yOffset = 0) {
  const s = new THREE.Shape();
  const p = (x: number, y: number) => [x * scale, y * scale + yOffset] as const;
  s.moveTo(...p(0, 1.4));
  s.lineTo(...p(1.12, 1.02));
  s.lineTo(...p(1.12, -0.1));
  s.bezierCurveTo(...p(1.12, -0.88), ...p(0.66, -1.34), ...p(0, -1.6));
  s.bezierCurveTo(...p(-0.66, -1.34), ...p(-1.12, -0.88), ...p(-1.12, -0.1));
  s.lineTo(...p(-1.12, 1.02));
  s.closePath();
  return s;
}

/** Creates a three.js resource once and frees its GPU memory on unmount (three re-uploads lazily if reused). */
function useDisposable<T extends { dispose(): void }>(factory: () => T): T {
  const [obj] = useState(factory);
  useEffect(() => () => obj.dispose(), [obj]);
  return obj;
}

/* ── pointer (mouse/pen only; touch never drives parallax) ──── */
function usePointer(enabled: boolean) {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return p;
}

/* ── shield ──────────────────────────────────────────────────── */
function Shield({ p }: { p: ScenePalette }) {
  const frame = useDisposable(
    () => {
      const outer = shieldShape(1);
      outer.holes.push(shieldShape(0.74, 0.02));
      return new THREE.ExtrudeGeometry(outer, {
        depth: 0.34,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.05,
        bevelSegments: 5,
        curveSegments: 28,
      });
    },
  );
  const plate = useDisposable(
    () =>
      new THREE.ExtrudeGeometry(shieldShape(0.76, 0.02), {
        depth: 0.04,
        bevelEnabled: false,
        curveSegments: 28,
      }),
  );
  const swoosh = useDisposable(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.62, -0.52);
    s.bezierCurveTo(-0.8, 0.12, 0.5, 0.56, 1.72, 0.72);
    s.bezierCurveTo(0.62, 0.12, -0.22, -0.5, -0.74, -1.2);
    s.bezierCurveTo(-1.02, -0.98, -1.4, -0.8, -1.62, -0.52);
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 32 });
  });

  return (
    <group position={[0, 0, -0.17]}>
      <mesh geometry={frame}>
        <meshPhysicalMaterial color={p.frame} metalness={p.frameMetal} roughness={0.24} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={p.envIntensity} />
      </mesh>
      <mesh geometry={plate} position={[0, 0, 0.15]}>
        <meshPhysicalMaterial color={p.plate} transparent opacity={p.plateOpacity} roughness={0.15} metalness={0.1} />
      </mesh>
      <mesh geometry={swoosh} position={[0, 0, 0.26]}>
        <meshStandardMaterial color={p.swoosh} emissive={p.swooshEmissive} emissiveIntensity={p.swooshGlow} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
}

/* ── protective boundary: instanced pillars that rise on load ── */
function Pillars({ count, radius, instant, p }: { count: number; radius: number; instant: boolean; p: ScenePalette }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const heights = useMemo(
    () => Array.from({ length: count }, (_, i) => 0.28 + 0.34 + (Math.sin(i * 1.7) + Math.sin(i * 0.63 + 1)) * 0.2),
    [count],
  );
  const base = -1.55;

  const apply = (elapsed: number) => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const k = ease((elapsed - 0.5 - i * 0.025) / 1.3);
      const h = Math.max(0.0001, heights[i]! * k);
      dummy.position.set(Math.cos(a) * radius, base + h / 2, Math.sin(a) * radius);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    const hi = new THREE.Color(p.pillarB);
    for (let i = 0; i < count; i++) {
      c.set(p.pillarA).lerp(hi, (heights[i]! - 0.3) / 0.7);
      m.setColorAt(i, c);
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (instant) apply(99);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, instant, p]);

  const done = useRef(false);
  useFrame((state) => {
    if (instant || done.current) return;
    const t = state.clock.elapsedTime;
    apply(t);
    if (t > count * 0.025 + 2.2) done.current = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.05, 1, 0.05]} />
      <meshStandardMaterial color="#ffffff" emissive={p.pillarEmissive} emissiveIntensity={p.pillarGlow} roughness={0.35} metalness={0.4} />
    </instancedMesh>
  );
}

function Rings({ radius, p }: { radius: number; p: ScenePalette }) {
  return (
    <group>
      <mesh rotation-x={Math.PI / 2} position={[0, -1.55, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 160]} />
        <meshBasicMaterial color={p.ringA} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, -1.55, 0]}>
        <torusGeometry args={[radius * 1.28, 0.006, 8, 160]} />
        <meshBasicMaterial color={p.ringB} toneMapped={false} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/* ── orbiting life objects (all primitives, shared materials) ── */
function LifeObjects({ radius, p }: { radius: number; p: ScenePalette }) {
  const invalidate = useThree((s) => s.invalidate);
  const orbit = useRef<THREE.Group>(null);
  const body = useDisposable(
    () => new THREE.MeshPhysicalMaterial({ color: p.body, roughness: 0.32, metalness: 0.25, clearcoat: 0.7 }),
  );
  const accent = useDisposable(
    () => new THREE.MeshStandardMaterial({ color: p.accent, emissive: p.accentEmissive, emissiveIntensity: p.accentGlow }),
  );
  // Materials are created once; recolour them (not recreate) when the theme changes.
  useEffect(() => {
    body.color.set(p.body);
    accent.color.set(p.accent);
    accent.emissive.set(p.accentEmissive);
    accent.setValues({ emissiveIntensity: p.accentGlow });
    invalidate();
  }, [p, body, accent, invalidate]);

  useFrame((state, dt) => {
    if (!orbit.current) return;
    orbit.current.rotation.y += dt * 0.12;
    orbit.current.children.forEach((c, i) => {
      c.position.y = -0.55 + Math.sin(state.clock.elapsedTime * 0.9 + i * 1.7) * 0.07;
    });
  });

  const place = (i: number) => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    return { pos: [Math.cos(a) * radius, -0.55, Math.sin(a) * radius] as [number, number, number], rot: -a + Math.PI / 2 };
  };

  const house = place(0);
  const car = place(1);
  const person = place(2);
  const cross = place(3);

  return (
    <group ref={orbit}>
      {/* property — house */}
      <group position={house.pos} rotation-y={house.rot} scale={0.62}>
        <mesh material={body} position={[0, 0.3, 0]}>
          <boxGeometry args={[0.9, 0.6, 0.8]} />
        </mesh>
        <mesh material={accent} position={[0, 0.85, 0]} rotation-y={Math.PI / 4}>
          <coneGeometry args={[0.78, 0.5, 4]} />
        </mesh>
        <mesh material={accent} position={[0, 0.2, 0.41]}>
          <boxGeometry args={[0.18, 0.34, 0.02]} />
        </mesh>
      </group>
      {/* motor — car */}
      <group position={car.pos} rotation-y={car.rot} scale={0.58}>
        <mesh material={body} position={[0, 0.28, 0]}>
          <boxGeometry args={[1.5, 0.34, 0.7]} />
        </mesh>
        <mesh material={body} position={[0.05, 0.56, 0]}>
          <boxGeometry args={[0.8, 0.28, 0.6]} />
        </mesh>
        <mesh material={accent} position={[0.05, 0.57, 0]}>
          <boxGeometry args={[0.82, 0.12, 0.62]} />
        </mesh>
        {[-0.5, 0.5].flatMap((x) =>
          [-0.36, 0.36].map((z) => (
            <mesh key={`${x}${z}`} material={body} position={[x, 0.14, z]} rotation-x={Math.PI / 2}>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 20]} />
            </mesh>
          )),
        )}
      </group>
      {/* life — person */}
      <group position={person.pos} rotation-y={person.rot} scale={0.62}>
        <mesh material={body} position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.2, 0.55, 6, 16]} />
        </mesh>
        <mesh material={accent} position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.17, 24, 24]} />
        </mesh>
      </group>
      {/* health — cross */}
      <group position={cross.pos} rotation-y={cross.rot} scale={0.62}>
        <mesh material={accent} position={[0, 0.62, 0]}>
          <boxGeometry args={[0.76, 0.24, 0.2]} />
        </mesh>
        <mesh material={accent} position={[0, 0.62, 0]}>
          <boxGeometry args={[0.24, 0.76, 0.2]} />
        </mesh>
        <mesh material={body} position={[0, 0.62, -0.02]}>
          <cylinderGeometry args={[0.52, 0.52, 0.12, 40]} />
        </mesh>
      </group>
    </group>
  );
}

/* ── soft glow behind the shield (cheap stand-in for bloom) ──── */
function Glow({ p }: { p: ScenePalette }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, p.glowInner);
    grad.addColorStop(1, p.glowOuter);
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, [p]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, 0, -1.6]} scale={8}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        blending={p.glowAdditive ? THREE.AdditiveBlending : THREE.NormalBlending}
        opacity={p.glowOpacity}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── rig: pointer parallax + idle float + entrance ───────────── */
function Rig({ reduced, compact, children }: { reduced: boolean; compact: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const pointer = usePointer(!reduced && !compact);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const k = reduced ? 1 : ease(t / 1.6);
    g.scale.setScalar(0.82 + 0.18 * k);
    const ty = pointer.current.x * 0.38 + Math.sin(t * 0.25) * 0.06;
    const tx = pointer.current.y * 0.16;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 3, dt);
    g.position.y = Math.sin(t * 0.8) * 0.05;
  });
  return <group ref={group}>{children}</group>;
}

type Props = { theme: Theme; active: boolean; reduced: boolean; compact: boolean; wide: boolean; onReady: () => void; onLost: () => void };

/** Side-by-side layout: push the whole composition into the right-hand ~58% of the viewport. */
function Stage({ wide, children }: { wide: boolean; children: React.ReactNode }) {
  const viewportWidth = useThree((s) => s.viewport.width);
  return <group position={[wide ? viewportWidth * 0.15 : 0, 0, 0]}>{children}</group>;
}

/** Aim the camera slightly down at the shield so the boundary ring reads as an ellipse, not a flat line. */
function Aim() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, -0.35, 0);
  }, [camera]);
  return null;
}

export default function HeroScene({ theme, active, reduced, compact, wide, onReady, onLost }: Props) {
  const radius = 2.7;
  const p = SCENE_PALETTES[theme];
  return (
    <Canvas
      dpr={compact ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, compact ? 1.6 : 2.1, compact ? 11.2 : 12.6], fov: 32 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost();
        });
        onReady();
      }}
      aria-hidden
    >
      <ambientLight intensity={p.ambient} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color={p.key} />
      <pointLight position={[-4, -1, 3]} intensity={p.fillIntensity} color={p.fill} />
      <Environment key={theme} resolution={256} frames={1}>
        <Lightformer form="rect" intensity={p.lights.keyI} color={p.lights.key} position={[-4, 3, 4]} scale={[7, 3, 1]} />
        <Lightformer form="rect" intensity={p.lights.washI} color={p.lights.wash} position={[5, 0.5, -3]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="ring" intensity={p.lights.ringI} color={p.lights.ring} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={4} />
        <Lightformer form="rect" intensity={p.lights.lowI} color={p.lights.low} position={[0, -3, 3]} scale={[8, 1, 1]} />
      </Environment>

      <Aim />
      <Stage wide={wide}>
        <Glow p={p} />
        <Rig reduced={reduced} compact={compact}>
          <group rotation-x={-0.05}>
            <Shield p={p} />
            <Pillars count={compact ? 28 : 56} radius={radius} instant={reduced} p={p} />
            <Rings radius={radius} p={p} />
            <LifeObjects radius={radius} p={p} />
          </group>
        </Rig>
      </Stage>
      {!compact && !reduced && <Sparkles count={46} scale={[9, 5, 9]} size={2.2} speed={0.25} opacity={p.sparkleOpacity} color={p.sparkle} />}
    </Canvas>
  );
}
