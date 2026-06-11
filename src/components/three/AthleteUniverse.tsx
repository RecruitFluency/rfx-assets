import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useMediaQuery } from "../../hooks/useInteractions";
import { seeded } from "../../lib/utils";

/* ------------------------------------------------------------------ *
 * RFX Athlete Universe
 * Thousands of glowing athlete nodes drifting in 3D space, wired by
 * dynamic recruiting pathways. The camera parallaxes toward the pointer
 * so the whole ecosystem feels alive. GPU particles via custom shaders.
 * ------------------------------------------------------------------ */

const PALETTE = [
  new THREE.Color("#2e8bff"), // electric
  new THREE.Color("#5ba8ff"),
  new THREE.Color("#ff2d3f"), // velocity
  new THREE.Color("#ffce4d"), // gold
  new THREE.Color("#9d6bff"), // plasma
  new THREE.Color("#27e0a4"), // mint
];

const nodeVertex = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vec3 p = position;
    // gentle organic drift
    p.x += sin(uTime * 0.3 + aSeed * 6.28) * 0.25;
    p.y += cos(uTime * 0.25 + aSeed * 6.28) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vTwinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aSeed * 20.0);
    gl_PointSize = uSize * aScale * vTwinkle * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const nodeFragment = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    // soft glowing core with a bright center
    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.15, d);
    float alpha = core * 0.55 + glow * 0.9;
    if (alpha < 0.01) discard;
    vec3 col = vColor * (1.0 + vTwinkle * 0.6);
    gl_FragColor = vec4(col, alpha * vTwinkle);
  }
`;

function Universe({ count, reduced }: { count: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Build node cloud + a web of nearest-neighbor pathways.
  const { positions, colors, scales, seeds, linePositions, lineColors } =
    useMemo(() => {
      const rand = seeded(1337);
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const scales = new Float32Array(count);
      const seeds = new Float32Array(count);
      const pts: THREE.Vector3[] = [];

      for (let i = 0; i < count; i++) {
        // distribute in a flattened ellipsoidal volume
        const r = 6 + rand() * 30;
        const theta = rand() * Math.PI * 2;
        const phi = Math.acos(rand() * 2 - 1);
        const x = r * Math.sin(phi) * Math.cos(theta) * 1.4;
        const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
        const z = r * Math.cos(phi) * 1.1 - 6;
        positions.set([x, y, z], i * 3);
        pts.push(new THREE.Vector3(x, y, z));

        const c = PALETTE[Math.floor(rand() * PALETTE.length)];
        colors.set([c.r, c.g, c.b], i * 3);
        scales[i] = 0.5 + rand() * 2.2;
        seeds[i] = rand();
      }

      // Connect a subset of nodes to nearby nodes → recruiting pathways.
      const linePos: number[] = [];
      const lineCol: number[] = [];
      const maxLinks = reduced ? 220 : 520;
      let links = 0;
      for (let i = 0; i < count && links < maxLinks; i += 3) {
        const a = pts[i];
        // find a near-ish partner
        for (let j = i + 1; j < Math.min(i + 26, count); j++) {
          const b = pts[j];
          const dist = a.distanceTo(b);
          if (dist < 7 && rand() > 0.45) {
            linePos.push(a.x, a.y, a.z, b.x, b.y, b.z);
            const c = PALETTE[Math.floor(rand() * 2)]; // electric-ish links
            lineCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
            links++;
            break;
          }
        }
      }

      return {
        positions,
        colors,
        scales,
        seeds,
        linePositions: new Float32Array(linePos),
        lineColors: new Float32Array(lineCol),
      };
    }, [count, reduced]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: reduced ? 16 : 22 },
    }),
    [reduced]
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (group.current) {
      // slow autonomous rotation + pointer parallax
      group.current.rotation.y += delta * 0.02;
      const tx = pointer.x * 0.25;
      const ty = -pointer.y * 0.18;
      group.current.rotation.x += (ty - group.current.rotation.x) * 0.03;
      group.current.position.x += (pointer.x * 2 - group.current.position.x) * 0.02;
      group.current.position.y += (-pointer.y * 1.4 - group.current.position.y) * 0.02;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.04;
      // keep base y rotation offset from parallax
      group.current.rotation.y += (tx - 0) * 0.0;
    }
    if (lines.current) {
      const mat = lines.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export function AthleteUniverse() {
  const reduced = useMediaQuery("(max-width: 768px)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const count = reduced ? 1400 : 3000;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Universe canvas, masked to fade into the page below the fold */}
      <div className="absolute inset-0 mask-fade-b">
        <Canvas
          dpr={[1, reduced ? 1.5 : 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 26], fov: 62 }}
          frameloop={prefersReduced ? "demand" : "always"}
        >
          <fog attach="fog" args={["#05060a", 22, 58]} />
          <Universe count={count} reduced={reduced} />
        </Canvas>
      </div>

      {/* Cinematic vignette + lighting wash layered over the WebGL */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 38%, transparent, rgba(5,6,10,0.55) 78%, #05060a 100%)",
        }}
      />
    </div>
  );
}
