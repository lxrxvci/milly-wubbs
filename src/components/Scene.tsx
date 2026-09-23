import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { Environment, Lightformer } from '@react-three/drei';
import { audioEngine, scrollStore, actState, pushAmount } from '../lib/engine';
import type { QualityTier } from '../lib/engine';

/* ------------------------------------------------------------------ */
/* Audio-reactive particle field — monochrome silver, coral at push    */
/* ------------------------------------------------------------------ */

const particleVert = /* glsl */ `
  uniform float uTime;
  uniform float uBass;
  uniform float uPunch;
  uniform float uScroll;
  uniform float uEnergy;
  attribute float aScale;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec3 p = position;
    float t = uTime * 0.12 + aSeed * 6.2831;
    p.x += sin(t + p.y * 0.35) * 0.6 * (0.4 + uEnergy);
    p.y += cos(t * 0.8 + p.x * 0.25) * 0.5 * (0.4 + uEnergy);
    // kick agitation — the field shivers on each transient
    p.x += sin(aSeed * 43.0 + uTime * 9.0) * uPunch * 0.45 * uEnergy;
    p.y += cos(aSeed * 31.0 + uTime * 7.0) * uPunch * 0.35 * uEnergy;
    float breathe = 1.0 + (uBass * 0.7 + uPunch * 1.1) * uEnergy;
    p *= breathe;
    p.y += uScroll * 14.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aScale * (2.4 + (uBass * 2.5 + uPunch * 4.5) * uEnergy);
    gl_PointSize = size * (28.0 / -mv.z);
    vAlpha = smoothstep(-22.0, -4.0, mv.z) * (0.28 + uEnergy * 0.4 + uBass * 0.2 + uPunch * 0.3);
    vSeed = aSeed;
  }
`;

const particleFrag = /* glsl */ `
  precision highp float;
  uniform float uHighs;
  uniform float uPush;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float disc = smoothstep(0.5, 0.08, d);
    vec3 ash    = vec3(0.34, 0.34, 0.37);
    vec3 silver = vec3(0.79, 0.79, 0.83);
    vec3 white  = vec3(0.96, 0.96, 0.97);
    vec3 col = mix(ash, silver, clamp(vSeed * 1.6, 0.0, 1.0));
    col = mix(col, white, step(0.9, vSeed) * (0.35 + uHighs * 0.65));
    vec3 coral = vec3(1.0, 0.427, 0.106);
    col = mix(col, coral, uPush * (0.35 + 0.65 * step(0.55, vSeed)));
    gl_FragColor = vec4(col, disc * vAlpha);
  }
`;

function ParticleField({ tier }: { tier: QualityTier }) {
  const count = tier === 'high' ? 9000 : tier === 'medium' ? 4000 : 1500;

  const { positions, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.pow(Math.random(), 0.6) * 14;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9 - (r * 0.08);
      positions[i * 3 + 2] = Math.sin(a) * r - 4;
      scales[i] = 0.4 + Math.random() * 1.6;
      seeds[i] = Math.random();
    }
    return { positions, scales, seeds };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBass: { value: 0 },
    uPunch: { value: 0 },
    uHighs: { value: 0 },
    uPush: { value: 0 },
    uScroll: { value: 0 },
    uEnergy: { value: 0.6 },
  }), []);

  useFrame((_, dt) => {
    audioEngine.update();
    // drift speed rides the mids — the field hurries when the track does
    uniforms.uTime.value += dt * (0.7 + audioEngine.mids * 1.1 + audioEngine.punch * 0.4);
    uniforms.uBass.value = audioEngine.bass;
    uniforms.uPunch.value = audioEngine.punch;
    uniforms.uHighs.value = audioEngine.highs;
    uniforms.uScroll.value = scrollStore.progress;
    uniforms.uPush.value = pushAmount(scrollStore.progress);
    uniforms.uEnergy.value = actState(scrollStore.progress).energy;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Lasers — white beams, one coral. Gain follows the act map:          */
/* storm acts only; they die completely for the breakdown.             */
/* ------------------------------------------------------------------ */

const laserVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const laserFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uPulse;
  varying vec2 vUv;
  void main() {
    float across = 1.0 - abs(vUv.x - 0.5) * 2.0;
    float along = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
    float a = pow(across, 3.0) * along * uPulse;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Lasers() {
  const beams = useMemo(() => [
    { rot: 0.5,  color: new THREE.Color('#e8e8ec'), x: -5 },
    { rot: -0.4, color: new THREE.Color('#ff6d1b'), x: 0 },   // the accent beam
    { rot: 0.9,  color: new THREE.Color('#c9c9cf'), x: 4 },
    { rot: -0.9, color: new THREE.Color('#f4f4f5'), x: 7 },
  ], []);
  const mats = useRef<THREE.ShaderMaterial[]>([]);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollStore.progress;
    const act = actState(p);
    const push = pushAmount(p);
    const bass = audioEngine.bass;
    const punch = audioEngine.punch;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const isAccent = i === 1;
      const gain = isAccent ? (0.2 + push * 1.6) : (1.0 - push * 0.4);
      // act gain gates the whole rig; idle floor so beams breathe even
      // pre-audio — kicks flash the rig via punch
      m.uniforms.uPulse.value = act.lasers * gain * (0.16 + bass * 0.7 + punch * 1.4) * (0.7 + 0.3 * Math.sin(i * 1.7));
    });
    // motion is what reads as alive: beams sweep with the low end and
    // flare wider on each kick
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const sway = 0.05 + bass * 0.14 + punch * 0.22;
      mesh.rotation.z = beams[i].rot + Math.sin(t * (0.4 + i * 0.13) + i * 2.1) * sway;
      mesh.scale.x = 1 + punch * 0.8;
    });
  });

  return (
    <group position={[0, 6, -10]}>
      {beams.map((b, i) => (
        <mesh
          key={i}
          ref={(m) => { meshes.current[i] = m; }}
          position={[b.x, -4, 0]}
          rotation={[0, 0, b.rot]}
        >
          <planeGeometry args={[1.4, 34]} />
          <shaderMaterial
            ref={(m) => { if (m) mats.current[i] = m; }}
            vertexShader={laserVert}
            fragmentShader={laserFrag}
            uniforms={{ uColor: { value: b.color }, uPulse: { value: 0 } }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Chrome knot — the BREAKDOWN object. Enters on a scroll ramp,        */
/* owns the frame during its act, exits. Never furniture.              */
/* ------------------------------------------------------------------ */

function ChromeKnot() {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (!mesh.current || !mat.current) return;
    const knot = actState(scrollStore.progress).knot; // 0..1 presence envelope
    const speed = 0.12 + audioEngine.mids * 0.5;
    mesh.current.rotation.x += dt * speed;
    mesh.current.rotation.y += dt * speed * 0.7;
    // entrance: scale + drift up as the envelope opens
    const s = 0.001 + knot * (1.0 + audioEngine.bass * 0.08 + audioEngine.punch * 0.22);
    mesh.current.scale.setScalar(s);
    mesh.current.position.y = -4.9 + (1 - knot) * -2.5 + Math.sin(scrollStore.progress * 9.0) * 0.3 * knot;
    mat.current.opacity = knot;
  });
  return (
    <mesh ref={mesh} position={[2.2, -7.4, -3]} rotation={[0.4, 0.2, 0]} scale={0.001}>
      <torusKnotGeometry args={[1.9, 0.5, 200, 32]} />
      <meshStandardMaterial ref={mat} color="#ffffff" metalness={1} roughness={0.14} transparent opacity={0} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig — scroll is the dolly, pointer is the operator           */
/* ------------------------------------------------------------------ */

const _target = new THREE.Vector3();

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    const p = scrollStore.progress;
    // dolly lunges down the track on each kick — inside the lerp target
    // so it settles back, never accumulates
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 13 - p * 6 - audioEngine.punch * 0.8, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -p * 10 + 1.5, 0.06);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(p * Math.PI * 2) * 1.6, 0.06);
    camera.position.x += pointer.x * 0.35;
    camera.position.y += pointer.y * 0.2;
    _target.set(pointer.x * 0.8, camera.position.y - 1.2 + pointer.y * 0.4, -6);
    camera.lookAt(_target);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Fog + post — fog follows the act map; bloom breathes with bass,     */
/* surges at the push; CA responds to scroll velocity.                 */
/* ------------------------------------------------------------------ */

function FogRig() {
  const { scene } = useThree();
  useFrame(() => {
    const fog = (scene.fog as THREE.FogExp2 | null);
    if (fog) fog.density += (actState(scrollStore.progress).fog - fog.density) * 0.05;
  });
  return null;
}

function PostStack() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloom = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ca = useRef<any>(null);
  useFrame(() => {
    const p = scrollStore.progress;
    const push = pushAmount(p);
    const v = scrollStore.veloSm;
    if (bloom.current) bloom.current.intensity = 0.45 + (audioEngine.bass * 0.3 + audioEngine.punch * 0.65) * actState(p).energy + push * 1.1 + v * 0.25;
    if (ca.current) {
      const o = 0.0004 + v * 0.0022;
      ca.current.offset.x = o;
      ca.current.offset.y = o;
    }
  });
  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={0.82} intensity={0.6} levels={7} />
      <ChromaticAberration ref={ca} offset={[0.0004, 0.0004]} radialModulation modulationOffset={0.3} />
      <Noise premultiply opacity={0.09} />
      <Vignette eskil={false} offset={0.24} darkness={0.82} />
    </EffectComposer>
  );
}

/* ------------------------------------------------------------------ */
/* Scene root                                                          */
/* ------------------------------------------------------------------ */

export default function Scene({ tier }: { tier: QualityTier }) {
  const dpr = tier === 'high' ? Math.min(window.devicePixelRatio, 2) : 1.25;
  return (
    <div className="mw-canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        camera={{ fov: 35, position: [0, 1.5, 13], near: 0.1, far: 60 }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fogExp2 attach="fog" args={['#0a0a0a', 0.055]} />
        <FogRig />
        <ParticleField tier={tier} />
        <Lasers />
        <ChromeKnot />
        <Environment resolution={256}>
          <Lightformer intensity={4} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 1, 1]} />
          <Lightformer intensity={2} position={[-5, 0, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 0.6, 1]} />
          <Lightformer intensity={1.5} position={[5, -1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 0.4, 1]} />
        </Environment>
        <CameraRig />
        {tier !== 'low' && <PostStack />}
      </Canvas>
    </div>
  );
}
