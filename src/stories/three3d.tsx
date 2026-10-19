import React, { useLayoutEffect, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FONT_FAMILY } from "../brand";

/**
 * Cenas 3D das histórias, com three.js via @remotion/three.
 *
 * Seguindo a skill threejs-react-three-fiber (.claude/skills), mas com uma
 * diferença que o Remotion exige: nada de `useFrame` nem relógio — tudo é
 * função do quadro atual, para o render ser determinístico quadro a quadro.
 * O container renderiza WebGL por software (`swangle`), então as cenas usam
 * poucas luzes, sem sombras e geometria leve.
 */

const W = 1920;
const H = 1080;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x: number) => {
  const c = clamp01(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/** gerador com semente: a mesma cena em todo render */
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

/** posiciona a câmera a cada quadro (a câmera do Canvas é só a inicial) */
const Rig: React.FC<{ pos: [number, number, number]; look?: [number, number, number] }> = ({ pos, look = [0, 0, 0] }) => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.lookAt(...look);
    camera.updateProjectionMatrix();
  });
  return null;
};

const Stage: React.FC<{ children: React.ReactNode; fov?: number }> = ({ children, fov = 40 }) => (
  <ThreeCanvas width={W} height={H} camera={{ position: [0, 0, 8], fov }} gl={{ antialias: true, alpha: true }} style={{ position: "absolute", inset: 0 }}>
    <ambientLight intensity={0.75} />
    <directionalLight position={[4, 6, 8]} intensity={2.2} />
    <directionalLight position={[-6, -2, 4]} intensity={0.6} color="#9CC7FF" />
    {children}
  </ThreeCanvas>
);

/** textura de cartão desenhada num canvas (cupom, voucher, envelope) */
const useCardTexture = (draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, key: string) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 360;
    const ctx = c.getContext("2d")!;
    draw(ctx, c.width, c.height);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/* ------------------------------------------------------------------ */
/* Vinheta: ondas de Wi-Fi em 3D                                        */
/* ------------------------------------------------------------------ */

/**
 * Anéis que se expandem como ondas de Wi-Fi a partir de uma esfera na cor do
 * produto, com partículas em órbita e a câmera avançando (reveal dramático).
 */
export const WaveSting3D: React.FC<{ accent: string }> = ({ accent }) => {
  const t = useT();
  const pts = useMemo(() => {
    const r = rng(3);
    const arr = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const rad = 2.5 + r() * 5;
      const a = r() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * rad;
      arr[i * 3 + 1] = (r() - 0.5) * 3.5;
      arr[i * 3 + 2] = Math.sin(a) * rad;
    }
    return arr;
  }, []);
  const dolly = easeOut(t / 1.6);
  const core = easeOut((t - 0.05) / 0.5);
  return (
    <Stage>
      <Rig pos={[0, 1.2 - dolly * 0.6, 12 - dolly * 4.5]} />
      <group rotation={[0.95, t * 0.35, 0]}>
        {Array.from({ length: 6 }, (_, i) => {
          const f = (t * 0.75 + i / 6) % 1;
          return (
            <mesh key={i} scale={0.4 + f * 4.2}>
              <torusGeometry args={[1, 0.022 / (0.4 + f * 4.2) + 0.012, 12, 96]} />
              <meshBasicMaterial color={i % 2 ? "#FFFFFF" : accent} transparent opacity={(1 - f) * 0.9 * core} />
            </mesh>
          );
        })}
      </group>
      <mesh scale={0.55 * core * (1 + Math.sin(t * 5) * 0.03)}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.55} roughness={0.25} />
      </mesh>
      <group rotation={[0.25, t * 0.25, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pts, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#FFFFFF" size={0.05} transparent opacity={0.75 * core} />
        </points>
      </group>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Explosão de cupons (Hora Premiada) e leque de vouchers (MyGuest)     */
/* ------------------------------------------------------------------ */

type CardFace = { title: string; big: string; small: string };

const drawCard = (accent: string, face: CardFace) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  roundRect(ctx, 0, 0, w, h, 36);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.fillStyle = accent;
  roundRect(ctx, 0, 0, 190, h, 36);
  ctx.fill();
  ctx.fillRect(150, 0, 40, h);
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(206, 24);
  ctx.lineTo(206, h - 24);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 64px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.translate(95, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(face.title, 0, 0);
  ctx.restore();
  // o texto encolhe para caber na área branca do cartão
  const fit = (txt: string, weight: number, size: number, max: number) => {
    let s = size;
    ctx.font = `${weight} ${s}px ${FONT_FAMILY}`;
    while (ctx.measureText(txt).width > max && s > 10) {
      s -= 2;
      ctx.font = `${weight} ${s}px ${FONT_FAMILY}`;
    }
  };
  ctx.fillStyle = "#1B2430";
  ctx.textAlign = "left";
  fit(face.big, 900, 104, w - 270);
  ctx.fillText(face.big, 236, h / 2 - 22);
  ctx.fillStyle = "#6B7684";
  fit(face.small, 700, 34, w - 270);
  ctx.fillText(face.small, 240, h / 2 + 72);
};

const Card: React.FC<{ accent: string; face: CardFace; position: [number, number, number]; rotation: [number, number, number]; scale?: number }> = ({
  accent,
  face,
  position,
  rotation,
  scale = 1,
}) => {
  const tex = useCardTexture(drawCard(accent, face), `${accent}-${face.big}-${face.small}`);
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1.78, 1, 0.035]} />
      <meshStandardMaterial attach="material-0" color={accent} />
      <meshStandardMaterial attach="material-1" color={accent} />
      <meshStandardMaterial attach="material-2" color={accent} />
      <meshStandardMaterial attach="material-3" color={accent} />
      <meshStandardMaterial attach="material-4" map={tex} roughness={0.45} />
      <meshStandardMaterial attach="material-5" color={accent} roughness={0.5} />
    </mesh>
  );
};

/**
 * Cupons saindo do centro em todas as direções, girando e desacelerando —
 * o impacto (ação) seguido de ondulação e assentamento (resolução).
 */
export const CouponBurst3D: React.FC<{ accent: string; face: CardFace; count?: number; at?: number }> = ({ accent, face, count = 18, at = 0.15 }) => {
  const t = useT();
  const cards = useMemo(() => {
    const r = rng(9);
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + r() * 0.4;
      const reach = 2.6 + r() * 3.2;
      return {
        dir: [Math.cos(a) * reach * 1.5, Math.sin(a) * reach * 0.85, 1 + r() * 4] as [number, number, number],
        spin: [(r() - 0.5) * 6, (r() - 0.5) * 6, (r() - 0.5) * 3] as [number, number, number],
        delay: r() * 0.18,
      };
    });
  }, [count]);
  const shake = t > at && t < at + 0.3 ? Math.sin(t * 90) * 0.04 * (1 - (t - at) / 0.3) : 0;
  return (
    <Stage>
      <Rig pos={[shake, shake * 0.6, 9.5 - easeOut((t - at) / 1.5) * 1.2]} />
      {cards.map((c, i) => {
        const p = easeOut((t - at - c.delay) / 1.1);
        const drift = Math.max(0, t - at - 1.2) * 0.15;
        const s = Math.min(1, p * 3);
        return (
          <Card
            key={i}
            accent={accent}
            face={face}
            position={[c.dir[0] * (p + drift * 0.3), c.dir[1] * (p + drift * 0.3), c.dir[2] * p - 2]}
            rotation={[c.spin[0] * p + 0.2, c.spin[1] * p, c.spin[2] * p + t * 0.15]}
            scale={0.6 * s}
          />
        );
      })}
      <Card accent={accent} face={face} position={[0, 0, 1.2]} rotation={[-0.15 + Math.sin(t * 1.4) * 0.05, Math.sin(t * 1.1) * 0.25, 0]} scale={1.25 * easeOut((t - at - 0.25) / 0.5)} />
    </Stage>
  );
};

/** Vouchers abrindo em leque; o do centro vem para a frente. */
export const VoucherFan3D: React.FC<{ accent: string; faces: CardFace[]; hero: CardFace }> = ({ accent, faces, hero }) => {
  const t = useT();
  const n = faces.length;
  const fan = easeOut((t - 0.1) / 0.8);
  const heroIn = easeInOut((t - 0.9) / 0.6);
  return (
    <Stage>
      <Rig pos={[0, 0.3, 9 - heroIn * 1.2]} />
      {faces.map((f, i) => {
        const a = (i - (n - 1) / 2) * 0.22 * fan;
        return (
          <Card
            key={i}
            accent={accent}
            face={f}
            position={[Math.sin(a) * 5.2, Math.cos(a) * 5.2 - 5.4 - heroIn * 1.1, -i * 0.02 - heroIn * 1.5]}
            rotation={[0, 0, -a]}
            scale={1.6 * (1 - heroIn * 0.3)}
          />
        );
      })}
      <Card accent={accent} face={hero} position={[0, -0.4 + heroIn * 0.6, 1.5 * heroIn]} rotation={[0, (1 - heroIn) * Math.PI + Math.sin(t * 1.2) * 0.12, 0]} scale={heroIn * 1.9} />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Mensagens voando até os clientes (Sending)                           */
/* ------------------------------------------------------------------ */

const drawEnvelope = (accent: string) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  roundRect(ctx, 0, 0, w, h, 28);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 22;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(24, 24);
  ctx.lineTo(w / 2, h * 0.62);
  ctx.lineTo(w - 24, 24);
  ctx.stroke();
};

export const MessageFlight3D: React.FC<{ accent: string; dot: string }> = ({ accent, dot }) => {
  const t = useT();
  const tex = useCardTexture(drawEnvelope(accent), `env-${accent}`);
  const targets = useMemo(() => {
    const r = rng(21);
    const out: { x: number; z: number; at: number }[] = [];
    for (let i = 0; i < 46; i++) out.push({ x: -1 + r() * 8, z: -4 + r() * 8, at: 0.25 + r() * 1.7 });
    return out.sort((a, b) => a.at - b.at);
  }, []);
  const origin = new THREE.Vector3(-4.2, 0, 0.5);
  const orbit = 0.5 + t * 0.12;
  return (
    <Stage fov={38}>
      <Rig pos={[Math.sin(orbit) * 11 + 1, 7.5, Math.cos(orbit) * 11]} look={[1, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -0.02, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#1A8FC6" roughness={0.9} />
      </mesh>
      {/* a loja, de onde saem as mensagens */}
      <group position={origin}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.4, 1.2, 1.4]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <boxGeometry args={[1.6, 0.5, 1.6]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
      {targets.map((g, i) => {
        const p = clamp01((t - g.at) / 0.75);
        const arrived = p >= 1;
        const pulse = arrived ? 1 + Math.max(0, 1 - (t - g.at - 0.75) * 3) * 0.8 : 1;
        const fly = p > 0 && !arrived;
        const e = easeInOut(p);
        const x = origin.x + (g.x - origin.x) * e;
        const z = origin.z + (g.z - origin.z) * e;
        const y = 1.6 + Math.sin(e * Math.PI) * 2.6 - e * 1.3;
        return (
          <group key={i}>
            <mesh position={[g.x, 0.12, g.z]} scale={0.16 * pulse}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color={arrived ? dot : "#DDF2FB"} emissive={arrived ? dot : "#000000"} emissiveIntensity={arrived ? 0.5 : 0} />
            </mesh>
            {fly && (
              <mesh position={[x, y, z]} rotation={[-0.5, Math.atan2(g.x - origin.x, g.z - origin.z), Math.sin(e * 6) * 0.2]} scale={0.55}>
                <boxGeometry args={[1, 0.6, 0.03]} />
                <meshStandardMaterial attach="material-4" map={tex} />
                <meshStandardMaterial attach="material-5" color="#FFFFFF" />
                <meshStandardMaterial attach="material-0" color="#FFFFFF" />
                <meshStandardMaterial attach="material-1" color="#FFFFFF" />
                <meshStandardMaterial attach="material-2" color="#FFFFFF" />
                <meshStandardMaterial attach="material-3" color="#FFFFFF" />
              </mesh>
            )}
          </group>
        );
      })}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Mapa de calor em torres (Wimap)                                      */
/* ------------------------------------------------------------------ */

const COLS = 14;
const ROWS = 9;

/** calor de cada célula: concentrado na entrada; `balance` espalha para o fundo */
const heatAt = (c: number, r: number, balance: number) => {
  const x = (c - (COLS - 1) / 2) / COLS;
  const z = r / (ROWS - 1); // 0 = entrada, 1 = fundo
  const entrance = Math.exp(-((x * x) / 0.05 + (z * z) / 0.08));
  const cashier = 0.55 * Math.exp(-(((x - 0.32) ** 2) / 0.02 + ((z - 0.35) ** 2) / 0.04));
  const back = 0.6 * Math.exp(-(((x + 0.2) ** 2) / 0.05 + ((z - 0.85) ** 2) / 0.05));
  const base = 0.06 + entrance + cashier;
  const spread = 0.25 + 0.55 * entrance + cashier * 0.8 + back + 0.15 * (1 - z);
  return base * (1 - balance) + spread * balance;
};

export const HeatTowers3D: React.FC<{ balance?: number; at?: number }> = ({ balance = 0, at = 0.1 }) => {
  const t = useT();
  const orbit = -0.55 + t * 0.12;
  const cells = useMemo(() => {
    const out: { c: number; r: number }[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) out.push({ c, r });
    return out;
  }, []);
  const color = new THREE.Color();
  return (
    <Stage fov={36}>
      <Rig pos={[Math.sin(orbit) * 11, 8, Math.cos(orbit) * 11]} look={[0, 0.6, -0.5]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -0.5]}>
        <planeGeometry args={[COLS * 0.62 + 1, ROWS * 0.62 + 1]} />
        <meshStandardMaterial color="#E9EEF5" roughness={0.95} />
      </mesh>
      {/* porta da loja */}
      <mesh position={[0, 0.05, ROWS * 0.31 + 0.2 - 0.5]}>
        <boxGeometry args={[2.2, 0.1, 0.25]} />
        <meshStandardMaterial color="#941F91" />
      </mesh>
      {cells.map(({ c, r }) => {
        const h = heatAt(c, r, balance);
        // a onda de subida nasce na entrada (stagger em onda, 30–60 ms)
        const grow = easeOut((t - at - r * 0.06 - Math.abs(c - COLS / 2) * 0.015) / 0.5);
        const height = Math.max(0.04, h * 3.2 * grow);
        color.setHSL(0.15 - Math.min(1, h) * 0.15, 0.95, 0.55 - Math.min(1, h) * 0.08);
        return (
          <mesh key={`${c}-${r}`} position={[(c - (COLS - 1) / 2) * 0.62, height / 2, (ROWS / 2 - r) * 0.62 - 0.5]}>
            <boxGeometry args={[0.5, height, 0.5]} />
            <meshStandardMaterial color={color.getHex()} roughness={0.55} />
          </mesh>
        );
      })}
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Estrelas acendendo (Wiquest)                                         */
/* ------------------------------------------------------------------ */

const starShape = (() => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.42 : 1;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i) s.lineTo(x, y);
    else s.moveTo(x, y);
  }
  s.closePath();
  return s;
})();

export const Stars3D: React.FC<{ lit: number[]; gold?: string }> = ({ lit, gold = "#FFC23D" }) => {
  const t = useT();
  const geo = useMemo(() => new THREE.ExtrudeGeometry(starShape, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3 }), []);
  return (
    <Stage fov={34}>
      <Rig pos={[0, 0.4, 10]} />
      {lit.map((at, i) => {
        const on = clamp01((t - at) / 0.35);
        const x = Math.max(0, t - at);
        const popS = on > 0 ? 1 + Math.exp(-x * 8) * Math.sin(x * 18) * 0.35 : 1;
        const spin = easeOut(x / 0.6) * Math.PI * 2;
        const c = new THREE.Color("#5B6B85").lerp(new THREE.Color(gold), on);
        return (
          <mesh key={i} geometry={geo} position={[(i - 2) * 1.95, Math.sin(t * 2 + i) * 0.06, 0]} rotation={[0.1, spin + Math.sin(t + i) * 0.15, 0]} scale={0.8 * popS}>
            <meshStandardMaterial color={c.getHex()} emissive={on > 0 ? gold : "#000000"} emissiveIntensity={on * 0.45} metalness={0.25} roughness={0.35} />
          </mesh>
        );
      })}
    </Stage>
  );
};
