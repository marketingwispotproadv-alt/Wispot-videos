import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_FAMILY } from "../brand";
import { Cursor, INK, MUTED, Phone, Tap, typed } from "../demos/kit";
import { DashboardShell, Icon, IconName, Laptop, NavyBg, ProductLogo, WispotLogo } from "../explainers/ex-kit";
import { SKINS } from "../explainers/people";
import { DUR, EASE, Kinetic, pop, Tag, tween, useSeconds } from "../stories/motion";
import { Beat, fitBeats, IllustratedShot, SoftBg, WallClock } from "../stories/story-kit";

/**
 * "Por dentro do painel Wispot" — o vídeo do post de blog sobre gestão de
 * conectividade em escolas e faculdades, em motion graphics.
 *
 * A pauta do post pede: gancho sem logo ("Você sabe em qual horário a
 * biblioteca da sua faculdade lota?"), login no portal, painel de conexões
 * por horário, mapa de calor por espaço (WiMap) e uma pesquisa disparada pelo
 * Wi-Fi (WiQuest). A faculdade e os números do painel são de exemplo.
 */

const BLUE = "#0B91C1";
const INKC = "#1B2430";
const HEAT = ["#FFE27A", "#FFB347", "#FF7A3D", "#E5484D"];
const MENU: { icon: IconName; label: string }[] = [
  { icon: "chart", label: "Conexões" },
  { icon: "users", label: "Perfis" },
  { icon: "heat", label: "WiMap" },
  { icon: "star", label: "WiQuest" },
];

const ESTUDANTES = [
  { x: 470, y: 790, scale: 1.0, skin: SKINS[1], hair: "long" as const, hairColor: "#2A1C14", top: "#C94F7C", bottom: "#2E3440", pose: "sit" as const, behind: true, wifiAt: 0.5 },
  { x: 720, y: 790, scale: 1.0, skin: SKINS[2], hair: "short" as const, hairColor: "#1F1A17", top: "#3F8FD0", bottom: "#3B3F4A", pose: "sit" as const, behind: true, flip: true, wifiAt: 0.8, glasses: true },
  { x: 1230, y: 790, scale: 1.0, skin: SKINS[4], hair: "bun" as const, hairColor: "#8A5A35", top: "#4FAE84", bottom: "#4B5D78", pose: "sit" as const, behind: true, wifiAt: 1.1 },
  { x: 1480, y: 790, scale: 1.0, skin: SKINS[0], hair: "curly" as const, hairColor: "#5A3825", top: "#F2B33D", bottom: "#2E3440", pose: "sit" as const, behind: true, flip: true, wifiAt: 1.4 },
  { x: 250, y: 1000, scale: 1.2, skin: SKINS[3], hair: "short" as const, hairColor: "#1B1410", top: "#E36B4C", bottom: "#2E3440", pose: "phone" as const, wifiAt: 1.7 },
  { x: 1700, y: 1000, scale: 1.2, skin: SKINS[1], hair: "long" as const, hairColor: "#C99A5B", top: "#6C5CE7", bottom: "#2E3440", pose: "phone" as const, flip: true, wifiAt: 2.0, dress: true },
];

/* capa · o gancho, sem logo ----------------------------------------------- */

const Hook: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="library"
      accent={BLUE}
      cast={ESTUDANTES}
      back={<WallClock x={960} y={420} r={58} h={18} m={10} speed={500} t={t} />}
      keys={[
        { t: 0, x: 960, y: 560, z: 1.25 },
        { t: 4, x: 960, y: 540, z: 1.1 },
      ]}
    >
      <Kinetic lines={["Você sabe em qual horário", "a *biblioteca* da sua faculdade lota?"]} at={0.15} size={74} accent={BLUE} color={INKC} shadow={false} plate="#fff" top={830} />
    </IllustratedShot>
  );
};

/* 0 · cada espaço tem o seu pico ------------------------------------------- */

const SPACES: { icon: IconName; name: string; peak: string }[] = [
  { icon: "board", name: "Sala de aula", peak: "8h às 12h" },
  { icon: "book", name: "Biblioteca", peak: "?" },
  { icon: "flask", name: "Laboratório", peak: "14h às 17h" },
  { icon: "mic", name: "Auditório", peak: "em eventos" },
  { icon: "coffee", name: "Convivência", peak: "nos intervalos" },
];

const Spaces: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 34 }}>
        {SPACES.map((s, i) => {
          const at = 0.25 + i * 0.95;
          const p = pop(t, at);
          const peak = tween(t, 5.0 + i * 0.08, DUR.std);
          const unknown = s.peak === "?";
          return (
            <div
              key={s.name}
              style={{
                width: 300,
                height: 380,
                borderRadius: 34,
                background: "#fff",
                boxShadow: "0 24px 50px rgba(0,60,110,0.25)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 54,
                boxSizing: "border-box",
                fontFamily: FONT_FAMILY,
                transform: `scale(${Math.max(0, p)})`,
              }}
            >
              <div style={{ width: 120, height: 120, borderRadius: 60, background: "#E6F5FC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={66} color={BLUE} stroke={1.8} />
              </div>
              <div style={{ marginTop: 30, fontWeight: 900, fontSize: 36, color: INKC, letterSpacing: -0.5 }}>{s.name}</div>
              <div
                style={{
                  marginTop: 26,
                  padding: "10px 22px",
                  borderRadius: 999,
                  background: unknown ? "#FFE9E9" : "#E6F5FC",
                  color: unknown ? "#E5484D" : BLUE,
                  fontWeight: 800,
                  fontSize: 26,
                  opacity: peak,
                  transform: `translateY(${(1 - peak) * 16}px) scale(${unknown ? 1 + Math.max(0, Math.sin((t - 5) * 6)) * 0.08 * peak : 1})`,
                }}
              >
                Pico · {s.peak}
              </div>
            </div>
          );
        })}
      </div>
      <Kinetic lines={["Cada espaço tem o seu *horário de pico*."]} at={4.9} size={62} accent={BLUE} top={760} />
    </NavyBg>
  );
};

/* 1 · o Wi-Fi tradicional ------------------------------------------------- */

const Traditional: React.FC = () => {
  const t = useSeconds();
  const card = tween(t, 0.2, DUR.std);
  const empty = tween(t, 3.0, DUR.std);
  return (
    <SoftBg accent="#E5484D">
      <Tag text="Wi-Fi tradicional" at={0.1} accent="#E5484D" />
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 230,
          width: 700,
          padding: "40px 44px",
          borderRadius: 34,
          background: "#fff",
          boxShadow: "0 30px 70px rgba(0,0,0,0.14)",
          fontFamily: FONT_FAMILY,
          opacity: card,
          transform: `translateY(${(1 - card) * 30}px)`,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 28, color: MUTED }}>Wi-Fi do campus</div>
        <div style={{ marginTop: 10, fontWeight: 900, fontSize: 54, color: INKC, letterSpacing: -1, whiteSpace: "nowrap" }}>Senha: campus2026</div>
        <div style={{ marginTop: 34, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {["Alunos", "Professores", "Visitantes", "Vizinhos", "Todo mundo"].map((w, i) => {
            const p = tween(t, 0.9 + i * 0.22, DUR.std);
            return (
              <span key={w} style={{ padding: "10px 22px", borderRadius: 999, background: i === 4 ? "#FFE9E9" : "#F1F3F6", color: i === 4 ? "#E5484D" : INKC, fontWeight: 800, fontSize: 26, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
                {w}
              </span>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 230,
          width: 740,
          height: 440,
          borderRadius: 34,
          background: "#fff",
          border: "4px dashed #C9D1DB",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_FAMILY,
          opacity: empty,
          transform: `scale(${0.94 + empty * 0.06})`,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 120, color: "#C9D1DB", lineHeight: 1 }}>?</div>
        <div style={{ marginTop: 16, fontWeight: 800, fontSize: 36, color: MUTED }}>Nenhum dado sobre o uso</div>
      </div>
      <Kinetic lines={["Uma senha só.", "*Nenhuma* informação."]} at={3.4} size={70} accent="#E5484D" color={INKC} shadow={false} top={760} />
    </SoftBg>
  );
};

/* 2 · a virada: o Wi-Fi gera informação ------------------------------------- */

const ASKS: { icon: IconName; label: string; at: number }[] = [
  { icon: "users", label: "Quem", at: 2.9 },
  { icon: "clock", label: "Quando", at: 3.9 },
  { icon: "pin", label: "Onde", at: 4.5 },
  { icon: "chart", label: "Por quanto tempo", at: 5.1 },
];

const Turn: React.FC = () => {
  const t = useSeconds();
  const logo = pop(t, 0.7);
  return (
    <NavyBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", transform: `scale(${Math.max(0, logo)})` }}>
        <WispotLogo width={360} />
      </div>
      <Kinetic lines={["O Wi-Fi passa a gerar *informação*."]} at={1.6} size={64} accent={BLUE} top={400} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", justifyContent: "center", gap: 30 }}>
        {ASKS.map((a) => {
          const p = pop(t, a.at);
          return (
            <div
              key={a.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "22px 34px",
                borderRadius: 999,
                background: "#fff",
                fontFamily: FONT_FAMILY,
                fontWeight: 900,
                fontSize: 38,
                color: INKC,
                boxShadow: "0 18px 40px rgba(0,60,110,0.25)",
                transform: `scale(${Math.max(0, p)})`,
              }}
            >
              <Icon name={a.icon} size={44} color={BLUE} stroke={2.2} />
              {a.label}
            </div>
          );
        })}
      </div>
    </NavyBg>
  );
};

/* 3 · cartela: por dentro do painel ---------------------------------------- */

const TitleCard: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 32, letterSpacing: 10, color: "rgba(255,255,255,0.9)", opacity: tween(t, 0.1, DUR.std) }}>
        VEM VER
      </div>
      <Kinetic lines={["Por dentro do", "*painel* Wispot"]} at={0.2} size={120} accent={BLUE} top={400} />
    </NavyBg>
  );
};

/* 4 · login no portal ------------------------------------------------------- */

const SchoolMark: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 * size, fontFamily: FONT_FAMILY }}>
    <div style={{ width: 70 * size, height: 70 * size, borderRadius: 20 * size, background: "#14365F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name="cap" size={46 * size} color="#F2B33D" stroke={2} />
    </div>
    <div style={{ lineHeight: 1.05 }}>
      <div style={{ fontWeight: 600, fontSize: 20 * size, color: MUTED }}>Faculdade</div>
      <div style={{ fontWeight: 900, fontSize: 32 * size, color: "#14365F", letterSpacing: -0.5 }}>Horizonte</div>
    </div>
  </div>
);

const LOGIN = { profile: 3.3, typing: 3.8, enter: 5.6 };
const MATRICULA = "2026 0418";

const PortalLogin: React.FC<{ t: number }> = ({ t }) => {
  const done = t > LOGIN.enter + 0.15;
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #EAF1FA 0%, #FFFFFF 40%)", padding: "120px 40px 0", boxSizing: "border-box", fontFamily: FONT_FAMILY }}>
      <SchoolMark />
      <div style={{ marginTop: 50, fontWeight: 900, fontSize: 44, color: INKC, letterSpacing: -1, lineHeight: 1.1 }}>Wi-Fi do campus</div>
      <div style={{ marginTop: 8, fontWeight: 600, fontSize: 22, color: MUTED }}>Entre com o seu perfil</div>
      <div style={{ marginTop: 34, display: "flex", background: "#EEF1F5", borderRadius: 18, padding: 6 }}>
        {["Aluno", "Professor", "Visitante"].map((p, i) => {
          const on = i === 0 && t > LOGIN.profile;
          return (
            <div key={p} style={{ flex: 1, height: 64, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, background: on ? "#14365F" : "transparent", color: on ? "#fff" : INKC }}>
              {p}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 26, fontWeight: 700, fontSize: 20, color: MUTED }}>Matrícula</div>
      <div style={{ marginTop: 8, height: 70, borderRadius: 16, border: `3px solid ${t > LOGIN.typing && !done ? "#14365F" : "#D3D9E0"}`, display: "flex", alignItems: "center", padding: "0 20px", fontWeight: 800, fontSize: 30, color: INKC, letterSpacing: 2 }}>
        {typed(MATRICULA, t, LOGIN.typing, 12)}
      </div>
      <div
        style={{
          marginTop: 30,
          height: 80,
          borderRadius: 18,
          background: done ? "#2FA37A" : "#14365F",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: 30,
          transform: `scale(${t > LOGIN.enter && t < LOGIN.enter + 0.15 ? 0.96 : 1})`,
        }}
      >
        {done ? "✓ Conectado" : "Entrar"}
      </div>
      <div style={{ marginTop: 22, fontWeight: 600, fontSize: 17, color: MUTED, lineHeight: 1.4 }}>Ao entrar, você aceita os termos de uso e a política de privacidade (LGPD).</div>
      <Tap x={95} y={430} at={LOGIN.profile} />
      <Tap x={264} y={668} at={LOGIN.enter} />
    </div>
  );
};

const Login: React.FC = () => {
  const t = useSeconds();
  const phone = tween(t, 0.1, DUR.slow);
  return (
    <SoftBg accent={BLUE}>
      <Phone left={250} top={60 + (1 - phone) * 80} scale={0.84} style={{ transform: "scale(0.84)", opacity: phone }}>
        <PortalLogin t={t} />
      </Phone>
      <Tag text="1 · Login no portal" at={0.2} accent={BLUE} left={980} top={250} />
      <Kinetic lines={["Login *identificado*", "por perfil."]} at={0.6} size={92} accent={BLUE} color={INKC} shadow={false} align="left" left={980} top={330} width={900} />
      <div style={{ position: "absolute", left: 980, top: 600, display: "flex", gap: 14, fontFamily: FONT_FAMILY }}>
        {["Marca da faculdade", "Aluno · Professor · Visitante"].map((c, i) => {
          const p = tween(t, 2.2 + i * 0.5, DUR.std);
          return (
            <span key={c} style={{ padding: "12px 24px", borderRadius: 999, background: "#fff", color: INKC, fontWeight: 800, fontSize: 26, boxShadow: "0 10px 24px rgba(0,0,0,0.08)", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
              {c}
            </span>
          );
        })}
      </div>
    </SoftBg>
  );
};

/* 5 · a página de acesso comunica ------------------------------------------- */

const NOTICES: { icon: IconName; kicker: string; text: string; at: number; hot?: boolean }[] = [
  { icon: "bell", kicker: "Aviso", text: "Rematrícula aberta até sexta", at: 2.3 },
  { icon: "calendar", kicker: "Evento", text: "Feira de profissões · quinta, 19h", at: 3.0 },
  { icon: "book", kicker: "Semana de provas", text: "Biblioteca aberta até 22h", at: 3.9, hot: true },
];

const PortalHome: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #14365F 0%, #14365F 300px, #F4F6F9 300px)", padding: "110px 34px 0", boxSizing: "border-box", fontFamily: FONT_FAMILY }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 54, height: 54, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="cap" size={36} color="#14365F" stroke={2} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 26, color: "#fff" }}>Faculdade Horizonte</div>
    </div>
    <div style={{ marginTop: 26, fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: -1 }}>Olá, Júlia!</div>
    <div style={{ marginTop: 4, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.8)" }}>Você está conectada ao Wi-Fi do campus.</div>
    <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 18 }}>
      {NOTICES.map((n) => {
        const p = tween(t, n.at, DUR.std);
        return (
          <div
            key={n.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 20px",
              borderRadius: 22,
              background: n.hot ? "#FFF6DD" : "#fff",
              border: `3px solid ${n.hot ? "#F2B33D" : "transparent"}`,
              boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
            }}
          >
            <div style={{ width: 58, height: 58, borderRadius: 16, background: n.hot ? "#F2B33D" : "#E6F5FC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={n.icon} size={34} color={n.hot ? "#fff" : BLUE} stroke={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: n.hot ? "#B07A00" : MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{n.kicker}</div>
              <div style={{ fontWeight: 800, fontSize: 24, color: INKC }}>{n.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const Notices: React.FC = () => {
  const t = useSeconds();
  return (
    <SoftBg accent={BLUE}>
      <Phone left={250} top={60} scale={0.84} style={{ transform: "scale(0.84)" }}>
        <PortalHome t={t} />
      </Phone>
      <Kinetic lines={["A página de acesso", "também *comunica*."]} at={0.4} size={88} accent={BLUE} color={INKC} shadow={false} align="left" left={980} top={360} width={900} />
    </SoftBg>
  );
};

/* 6 · perfis e LGPD ------------------------------------------------------------ */

const PROFILES = [
  { label: "Alunos", n: 3812, color: BLUE },
  { label: "Professores", n: 246, color: "#6C5CE7" },
  { label: "Visitantes", n: 131, color: "#F2B33D" },
];
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(Math.round(n));

const LOG = [
  ["19:02", "Aluno", "Biblioteca"],
  ["19:01", "Professor", "Sala 204"],
  ["18:58", "Visitante", "Auditório"],
  ["18:57", "Aluno", "Convivência"],
];

const ProfilesScreen: React.FC<{ t: number }> = ({ t }) => (
  <DashboardShell menu={MENU} active={1} title="Acessos por perfil · hoje">
    <div style={{ display: "flex", gap: 22, fontFamily: FONT_FAMILY }}>
      {PROFILES.map((p, i) => {
        const at = 0.5 + i * 0.7;
        const k = tween(t, at, 1.0, EASE.out);
        return (
          <div key={p.label} style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "22px 26px", boxShadow: "0 6px 16px rgba(0,0,0,0.05)", opacity: tween(t, at - 0.1, DUR.std) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 22, color: MUTED }}>
              <span style={{ width: 14, height: 14, borderRadius: 7, background: p.color }} />
              {p.label}
            </div>
            <div style={{ marginTop: 6, fontWeight: 900, fontSize: 54, color: INK, letterSpacing: -1 }}>{fmt(p.n * k)}</div>
            <div style={{ marginTop: 10, height: 10, borderRadius: 5, background: "#EEF1F5" }}>
              <div style={{ width: `${(p.n / 3812) * 100 * k}%`, height: "100%", borderRadius: 5, background: p.color }} />
            </div>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 26, background: "#fff", borderRadius: 20, padding: "18px 26px", boxShadow: "0 6px 16px rgba(0,0,0,0.05)", fontFamily: FONT_FAMILY }}>
      <div style={{ fontWeight: 800, fontSize: 22, color: INK, marginBottom: 8 }}>Registro de acessos</div>
      {LOG.map((r, i) => {
        const p = tween(t, 2.6 + i * 0.25, DUR.std);
        return (
          <div key={i} style={{ display: "flex", padding: "12px 0", borderTop: "1px solid #EEF1F5", fontWeight: 700, fontSize: 22, color: INK, opacity: p }}>
            <span style={{ width: 120, color: MUTED }}>{r[0]}</span>
            <span style={{ width: 220 }}>{r[1]}</span>
            <span>{r[2]}</span>
          </div>
        );
      })}
    </div>
  </DashboardShell>
);

const Profiles: React.FC = () => {
  const t = useSeconds();
  const lgpd = pop(t, 4.3);
  return (
    <NavyBg>
      <Laptop left={300} top={50} width={1320}>
        <ProfilesScreen t={t} />
      </Laptop>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 900,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 30px",
          borderRadius: 999,
          background: "#fff",
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize: 32,
          color: INKC,
          boxShadow: "0 18px 40px rgba(0,60,110,0.3)",
          transform: `scale(${Math.max(0, lgpd)})`,
          transformOrigin: "left center",
        }}
      >
        <Icon name="shield" size={40} color="#2FA37A" stroke={2.2} />
        Registro de acordo com a LGPD
      </div>
    </NavyBg>
  );
};

/* 7 e 8 · conexões por horário --------------------------------------------- */

const HOURS = Array.from({ length: 16 }, (_, i) => 7 + i); // 7h às 22h
const CAMPUS = [0.35, 0.72, 0.9, 1.0, 0.82, 0.7, 0.86, 0.6, 0.55, 0.6, 0.5, 0.62, 0.78, 0.74, 0.5, 0.25];
const LIBRARY = [0.08, 0.15, 0.22, 0.3, 0.32, 0.4, 0.35, 0.38, 0.42, 0.48, 0.6, 0.82, 1.0, 0.88, 0.6, 0.3];
const PEAK = HOURS.indexOf(19);

const HourChart: React.FC<{ t: number; grow: number; library: number; callout: number }> = ({ t, grow, library, callout }) => {
  const W = 980;
  const H = 330;
  const bw = W / HOURS.length;
  return (
    <div style={{ position: "relative", width: W, height: H + 40, fontFamily: FONT_FAMILY }}>
      {HOURS.map((h, i) => {
        const g = tween(t, grow + i * 0.05, DUR.slow);
        const v = CAMPUS[i] + (LIBRARY[i] - CAMPUS[i]) * library;
        const peak = i === PEAK && library > 0.5;
        return (
          <React.Fragment key={h}>
            <div
              style={{
                position: "absolute",
                left: i * bw + 8,
                bottom: 40,
                width: bw - 16,
                height: v * H * g,
                borderRadius: "10px 10px 4px 4px",
                background: peak ? "#E5484D" : library > 0.5 ? "#9FD3EC" : BLUE,
              }}
            />
            <div style={{ position: "absolute", left: i * bw, bottom: 4, width: bw, textAlign: "center", fontWeight: 700, fontSize: 18, color: peak ? "#E5484D" : MUTED }}>{h}h</div>
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: PEAK * bw + bw / 2 - 150,
          bottom: 40 + H + 18,
          width: 300,
          padding: "12px 0",
          borderRadius: 16,
          background: "#E5484D",
          color: "#fff",
          textAlign: "center",
          fontWeight: 900,
          fontSize: 26,
          opacity: callout,
          transform: `translateY(${(1 - callout) * 20}px)`,
          boxShadow: "0 12px 26px rgba(229,72,77,0.35)",
        }}
      >
        Pico: 19h · 412 conectados
      </div>
    </div>
  );
};

const HoursScreen: React.FC<{ t: number; filterAt?: number; calloutAt?: number }> = ({ t, filterAt, calloutAt }) => {
  const lib = filterAt === undefined ? 0 : tween(t, filterAt + 0.15, DUR.slow, EASE.move);
  const callout = calloutAt === undefined ? 0 : tween(t, calloutAt, DUR.std);
  return (
    <DashboardShell menu={MENU} active={0} title="Conexões por horário · hoje">
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: FONT_FAMILY }}>
        <span style={{ fontWeight: 700, fontSize: 22, color: MUTED }}>Espaço</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 22px",
            borderRadius: 999,
            border: `3px solid ${lib > 0.5 ? BLUE : "#D3D9E0"}`,
            background: lib > 0.5 ? "#E6F5FC" : "#fff",
            fontWeight: 800,
            fontSize: 22,
            color: INK,
          }}
        >
          <Icon name={lib > 0.5 ? "book" : "pin"} size={24} color={BLUE} stroke={2.2} />
          {lib > 0.5 ? "Biblioteca" : "Campus inteiro"} ▾
        </span>
        <span style={{ marginLeft: "auto", fontWeight: 900, fontSize: 40, color: INK }}>{fmt(4189 + (1268 - 4189) * lib)}</span>
        <span style={{ fontWeight: 700, fontSize: 20, color: MUTED }}>conexões</span>
      </div>
      <div style={{ position: "absolute", left: 10, top: 130 }}>
        <HourChart t={t} grow={0.2} library={lib} callout={callout} />
      </div>
      {filterAt !== undefined && (
        <Cursor
          keys={[
            { t: 0, x: 700, y: 420 },
            { t: filterAt - 0.05, x: 300, y: 26 },
            { t: filterAt + 1.2, x: 860, y: 140 },
          ]}
          clicks={[filterAt]}
          from={0.1}
        />
      )}
    </DashboardShell>
  );
};

const Hours: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <Laptop left={300} top={50} width={1320}>
        <HoursScreen t={t} />
      </Laptop>
      <Tag text="2 · Conexões por horário" at={0.2} accent="#fff" dark left={90} top={960} />
    </NavyBg>
  );
};

const LibraryPeak: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <Laptop left={300} top={50} width={1320}>
        <HoursScreen t={t} filterAt={1.0} calloutAt={2.7} />
      </Laptop>
      <Kinetic lines={["A biblioteca lota às *19h*."]} at={3.0} size={56} accent={BLUE} top={950} />
    </NavyBg>
  );
};

/* 9 e 10 · mapa de calor (WiMap) --------------------------------------------- */

type Zone = { name: string; x: number; y: number; w: number; h: number; heat: (hour: number) => number; people: number };

const bell = (hour: number, center: number, width: number) => Math.exp(-(((hour - center) / width) ** 2));

const ZONES: Zone[] = [
  { name: "Salas de aula", x: 40, y: 40, w: 420, h: 250, heat: (h) => Math.max(bell(h, 9.5, 1.8), 0.7 * bell(h, 20, 1.2)), people: 1240 },
  { name: "Laboratório", x: 40, y: 320, w: 420, h: 200, heat: (h) => bell(h, 15.5, 1.5), people: 180 },
  { name: "Convivência", x: 490, y: 40, w: 380, h: 480, heat: (h) => Math.max(bell(h, 12.5, 0.9), 0.6 * bell(h, 10, 0.4), 0.6 * bell(h, 20.8, 0.5)), people: 860 },
  { name: "Biblioteca", x: 900, y: 40, w: 420, h: 300, heat: (h) => Math.max(0.25, bell(h, 19, 1.4)), people: 412 },
  { name: "Auditório", x: 900, y: 370, w: 420, h: 150, heat: (h) => 0.5 * bell(h, 20, 1), people: 96 },
];

const heatColor = (v: number) => HEAT[Math.min(HEAT.length - 1, Math.floor(v * HEAT.length * 0.999))];

const CampusMap: React.FC<{ hour: number; t: number; at: number; focus?: string }> = ({ hour, t, at, focus }) => {
  const appear = tween(t, at, DUR.slow);
  return (
    <svg width={1360} height={560} viewBox="0 0 1360 560" style={{ opacity: appear, transform: `translateY(${(1 - appear) * 30}px)` }}>
      <defs>
        <filter id="blur-heat" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>
      <rect x={0} y={0} width={1360} height={560} rx={30} fill="#fff" />
      {ZONES.map((z) => (
        <rect key={z.name} x={z.x} y={z.y} width={z.w} height={z.h} rx={18} fill="#F2F5F9" stroke="#D7DEE7" strokeWidth={3} />
      ))}
      <g filter="url(#blur-heat)">
        {ZONES.map((z) => {
          const v = z.heat(hour);
          return [0, 1, 2].map((k) => (
            <ellipse
              key={`${z.name}${k}`}
              cx={z.x + z.w * (0.3 + k * 0.2)}
              cy={z.y + z.h * (0.55 + (k % 2) * 0.1)}
              rx={z.w * 0.28 * (0.5 + v * 0.6)}
              ry={z.h * 0.3 * (0.5 + v * 0.6)}
              fill={heatColor(v)}
              opacity={0.15 + v * 0.75}
            />
          ));
        })}
      </g>
      {ZONES.map((z) => {
        const v = z.heat(hour);
        const hot = focus === z.name;
        return (
          <g key={z.name}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={18} fill="none" stroke={hot ? "#E5484D" : "transparent"} strokeWidth={6} />
            <text x={z.x + 22} y={z.y + 44} fontFamily={FONT_FAMILY} fontWeight={900} fontSize={28} fill={INKC}>
              {z.name}
            </text>
            <text x={z.x + 22} y={z.y + 78} fontFamily={FONT_FAMILY} fontWeight={700} fontSize={22} fill={MUTED}>
              {fmt(z.people * (0.15 + 0.85 * v))} conectados
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const MapShell: React.FC<{ hour: number; t: number; focus?: string; slider?: boolean; children?: React.ReactNode }> = ({ hour, t, focus, slider, children }) => {
  const logo = pop(t, 0.5);
  const s = (hour - 7) / 15;
  return (
    <NavyBg>
      <div style={{ position: "absolute", left: 90, top: 60, transform: `scale(${Math.max(0, logo)})`, transformOrigin: "left center" }}>
        <ProductLogo id="wimap" white height={70} />
      </div>
      <div style={{ position: "absolute", right: 90, top: 70, fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 54, color: "#fff" }}>
        {String(Math.floor(hour)).padStart(2, "0")}:{String(Math.floor((hour % 1) * 60)).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 280, top: 180 }}>
        <CampusMap hour={hour} t={t} at={0.2} focus={focus} />
      </div>
      {slider && (
        <div style={{ position: "absolute", left: 280, top: 790, width: 1360, fontFamily: FONT_FAMILY }}>
          <div style={{ position: "relative", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.35)" }}>
            <div style={{ width: `${s * 100}%`, height: "100%", borderRadius: 6, background: "#fff" }} />
            <div style={{ position: "absolute", left: `calc(${s * 100}% - 18px)`, top: -12, width: 36, height: 36, borderRadius: 18, background: "#fff", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontWeight: 800, fontSize: 24, color: "rgba(255,255,255,0.9)" }}>
            <span>7h</span>
            <span>12h</span>
            <span>17h</span>
            <span>22h</span>
          </div>
        </div>
      )}
      {children}
    </NavyBg>
  );
};

const HeatIntro: React.FC = () => {
  const t = useSeconds();
  return (
    <MapShell hour={10 + tween(t, 0.2, 4.5, EASE.move) * 0.5} t={t}>
      <Tag text="3 · Mapa de calor por espaço" at={0.3} accent="#fff" dark left={90} top={960} />
    </MapShell>
  );
};

const STOPS = [
  { at: 0, hour: 9.5, focus: "Salas de aula", label: "De manhã, as *salas de aula*." },
  { at: 1.9, hour: 12.5, focus: "Convivência", label: "No intervalo, a *convivência*." },
  { at: 3.6, hour: 19, focus: "Biblioteca", label: "À noite, a *biblioteca*." },
];

const HeatDay: React.FC = () => {
  const t = useSeconds();
  let hour = STOPS[0].hour;
  STOPS.forEach((s, i) => {
    if (i) hour += (s.hour - STOPS[i - 1].hour) * tween(t, s.at - 0.4, 0.8, EASE.move);
  });
  const cur = [...STOPS].reverse().find((s) => t >= s.at) ?? STOPS[0];
  return (
    <MapShell hour={hour} t={t + 10} focus={cur.focus} slider>
      {STOPS.map((s, i) => (
        <Kinetic key={s.focus} lines={[s.label]} at={s.at + 0.1} until={STOPS[i + 1] ? STOPS[i + 1].at - 0.3 : 999} size={52} accent={BLUE} top={900} />
      ))}
    </MapShell>
  );
};

/* 11 · a pesquisa pelo Wi-Fi (WiQuest) ---------------------------------------- */

const OPTIONS = ["Mais tomadas", "Mais horário", "Silêncio", "Wi-Fi mais rápido"];
const VOTE_AT = 2.4;

const SurveyScreen: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFF1E6 0%, #FFFFFF 40%)", padding: "120px 40px 0", boxSizing: "border-box", fontFamily: FONT_FAMILY }}>
    <SchoolMark size={0.8} />
    <div style={{ marginTop: 44, fontWeight: 800, fontSize: 20, color: "#F46904", letterSpacing: 1 }}>PESQUISA RÁPIDA · BIBLIOTECA</div>
    <div style={{ marginTop: 14, fontWeight: 900, fontSize: 42, lineHeight: 1.12, color: INKC, letterSpacing: -1 }}>O que falta na biblioteca à noite?</div>
    <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14 }}>
      {OPTIONS.map((o, i) => {
        const on = i === 0 && t > VOTE_AT;
        return (
          <div key={o} style={{ height: 76, borderRadius: 18, border: `3px solid ${on ? "#F46904" : "#E7D9CF"}`, background: on ? "#F46904" : "#fff", display: "flex", alignItems: "center", padding: "0 24px", fontWeight: 800, fontSize: 26, color: on ? "#fff" : INKC }}>
            {on ? "✓ " : ""}
            {o}
          </div>
        );
      })}
    </div>
    <Tap x={240} y={477} at={VOTE_AT} />
  </div>
);

const Survey: React.FC = () => {
  const t = useSeconds();
  const logo = pop(t, 0.6);
  return (
    <SoftBg accent="#F46904">
      <Phone left={250} top={60} scale={0.84} style={{ transform: "scale(0.84)" }}>
        <SurveyScreen t={t} />
      </Phone>
      <div style={{ position: "absolute", left: 980, top: 230, transform: `scale(${Math.max(0, logo)})`, transformOrigin: "left center" }}>
        <ProductLogo id="wiquest" height={84} />
      </div>
      <Tag text="4 · Pesquisa pelo Wi-Fi" at={0.2} accent="#F46904" left={980} top={150} />
      <Kinetic lines={["Pergunte *direto*", "pelo Wi-Fi."]} at={1.0} size={92} accent="#F46904" color={INKC} shadow={false} align="left" left={980} top={370} width={900} />
    </SoftBg>
  );
};

/* 12 · as respostas no painel ---------------------------------------------- */

const RESULTS = [
  { label: "Mais tomadas", v: 48 },
  { label: "Mais horário", v: 27 },
  { label: "Silêncio", v: 16 },
  { label: "Wi-Fi mais rápido", v: 9 },
];

const ResultsScreen: React.FC<{ t: number }> = ({ t }) => (
  <DashboardShell menu={MENU} active={3} title="Pesquisa · biblioteca à noite">
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT_FAMILY }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: "#E5484D", opacity: 0.5 + Math.abs(Math.sin(t * 4)) * 0.5 }} />
      <span style={{ fontWeight: 800, fontSize: 22, color: "#E5484D" }}>ao vivo</span>
      <span style={{ marginLeft: "auto", fontWeight: 900, fontSize: 44, color: INK }}>{fmt(1240 * tween(t, 0.2, 2.6, EASE.out))}</span>
      <span style={{ fontWeight: 700, fontSize: 22, color: MUTED }}>respostas</span>
    </div>
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 30, fontFamily: FONT_FAMILY }}>
      {RESULTS.map((r, i) => {
        const p = tween(t, 0.4 + i * 0.2, 1.2, EASE.out);
        return (
          <div key={r.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 28, color: INK }}>
              <span>{r.label}</span>
              <span style={{ color: i === 0 ? "#F46904" : MUTED }}>{Math.round(r.v * p)}%</span>
            </div>
            <div style={{ marginTop: 10, height: 24, borderRadius: 12, background: "#EEF1F5" }}>
              <div style={{ width: `${(r.v / 50) * 100 * p}%`, height: "100%", borderRadius: 12, background: i === 0 ? "#F46904" : "#F8B98A" }} />
            </div>
          </div>
        );
      })}
    </div>
  </DashboardShell>
);

const Results: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <Laptop left={300} top={50} width={1320}>
        <ResultsScreen t={t} />
      </Laptop>
    </NavyBg>
  );
};

/* 13 · tradicional × inteligente -------------------------------------------- */

const COMPARE = [
  ["Acesso", "Senha única compartilhada", "Login por perfil"],
  ["Informação", "Nenhuma sobre o uso", "Fluxo, picos e espaços"],
  ["Comunicação", "Não existe", "Avisos, eventos e pesquisas"],
  ["Decisão", "Baseada em reclamação", "Baseada em dados da rede"],
];

const Compare: React.FC = () => {
  const t = useSeconds();
  return (
    <NavyBg>
      <div style={{ position: "absolute", left: 210, top: 130, width: 1500, fontFamily: FONT_FAMILY }}>
        <div style={{ display: "flex", fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.85)", paddingBottom: 18, opacity: tween(t, 0.1, DUR.std) }}>
          <span style={{ width: 330 }} />
          <span style={{ flex: 1 }}>Wi-Fi tradicional</span>
          <span style={{ flex: 1.1 }}>Wi-Fi inteligente</span>
        </div>
        {COMPARE.map((r, i) => {
          const p = tween(t, 0.4 + i * 0.5, DUR.std);
          const last = i === COMPARE.length - 1;
          const hot = last ? tween(t, 2.8, DUR.std) : 0;
          return (
            <div
              key={r[0]}
              style={{
                display: "flex",
                alignItems: "center",
                height: 140,
                marginBottom: 16,
                borderRadius: 26,
                background: "#fff",
                padding: "0 34px",
                boxShadow: `0 ${14 + hot * 10}px ${30 + hot * 20}px rgba(0,60,110,${0.18 + hot * 0.15})`,
                opacity: p,
                transform: `translateX(${(1 - p) * -60}px) scale(${1 + hot * 0.03})`,
              }}
            >
              <span style={{ width: 296, fontWeight: 900, fontSize: 36, color: INKC }}>{r[0]}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 30, color: "#9AA3AE", textDecoration: last && hot > 0.5 ? "line-through" : "none" }}>{r[1]}</span>
              <span style={{ flex: 1.1, display: "flex", alignItems: "center", gap: 14, fontWeight: 900, fontSize: 32, color: BLUE }}>
                <Icon name="star" size={30} color={BLUE} stroke={2.4} />
                {r[2]}
              </span>
            </div>
          );
        })}
      </div>
    </NavyBg>
  );
};

/* 14 · a decisão na biblioteca -------------------------------------------------- */

const ACTIONS = [
  { text: "Biblioteca aberta até 22h", at: 0.3 },
  { text: "+40 tomadas nas mesas", at: 2.0 },
  { text: "Rede reforçada das 18h às 22h", at: 3.2 },
];

const Decision: React.FC = () => {
  const t = useSeconds();
  return (
    <IllustratedShot
      place="library"
      accent={BLUE}
      cast={ESTUDANTES.map((e) => ({ ...e, mood: "happy" as const, wifiAt: 0 }))}
      keys={[
        { t: 0, x: 760, y: 560, z: 1.25 },
        { t: 5.5, x: 700, y: 560, z: 1.32 },
      ]}
    >
      <div style={{ position: "absolute", right: 70, top: 120, width: 620, padding: "34px 36px", borderRadius: 30, background: "#fff", boxShadow: "0 30px 70px rgba(0,0,0,0.2)", fontFamily: FONT_FAMILY }}>
        <div style={{ fontWeight: 800, fontSize: 24, color: MUTED, letterSpacing: 1 }}>DECIDIDO COM DADOS</div>
        {ACTIONS.map((a) => {
          const p = tween(t, a.at, DUR.std);
          const check = pop(t, a.at + 0.25);
          return (
            <div key={a.text} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 26, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
              <span style={{ width: 52, height: 52, borderRadius: 26, background: "#2FA37A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 30, transform: `scale(${Math.max(0, check)})`, flexShrink: 0 }}>✓</span>
              <span style={{ fontWeight: 800, fontSize: 32, color: INKC, lineHeight: 1.15 }}>{a.text}</span>
            </div>
          );
        })}
      </div>
    </IllustratedShot>
  );
};

/* fim · Wispot e os números ---------------------------------------------------- */

const NUMBERS = [
  { n: "+30 mi", label: "usuários" },
  { n: "+10 mi", label: "conexões por dia" },
  { n: "+20 mil", label: "pontos de acesso" },
];

const Outro: React.FC = () => {
  const t = useSeconds();
  const logo = pop(t, 0.1);
  return (
    <NavyBg>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={{ transform: `scale(${Math.max(0, logo)})` }}>
          <WispotLogo width={460} />
        </div>
      </AbsoluteFill>
      <Kinetic lines={["Conectividade que vira *inteligência*", "para a educação."]} at={0.9} size={60} accent={BLUE} top={440} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 90, fontFamily: FONT_FAMILY, color: "#fff" }}>
        {NUMBERS.map((x, i) => {
          const p = tween(t, 1.8 + i * 0.15, DUR.std);
          return (
            <div key={x.label} style={{ textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
              <div style={{ fontWeight: 900, fontSize: 76, letterSpacing: -2 }}>{x.n}</div>
              <div style={{ fontWeight: 700, fontSize: 28, opacity: 0.9 }}>{x.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.75)", opacity: tween(t, 2.4, DUR.std) }}>
        Dados da base Wispot.
      </div>
    </NavyBg>
  );
};

/* assinatura · chamada para a demonstração ------------------------------------- */

const Demo: React.FC = () => {
  const t = useSeconds();
  const btn = pop(t, 1.6);
  return (
    <NavyBg>
      <Kinetic lines={["Quer ver isso na", "sua *instituição*?"]} at={0.1} size={96} accent={BLUE} top={230} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 230 }}>
        <div style={{ padding: "30px 64px", borderRadius: 999, background: "#fff", fontFamily: FONT_FAMILY, fontWeight: 900, fontSize: 48, color: BLUE, boxShadow: "0 24px 50px rgba(0,60,110,0.3)", transform: `scale(${Math.max(0, btn)})` }}>
          Agende uma demonstração
        </div>
        <div style={{ marginTop: 34, fontFamily: FONT_FAMILY, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: "#fff", opacity: tween(t, 2.0, DUR.std) }}>wispot.com.br</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 70, opacity: tween(t, 0.3, DUR.std) }}>
        <WispotLogo width={230} />
      </div>
    </NavyBg>
  );
};

/* sequência --------------------------------------------------------------------- */

export const PAINEL_BEATS: Beat[] = fitBeats("painel", [
  { key: "capa", seconds: 4.0, node: <Hook /> },
  { key: "0", seconds: 6.5, cut: "whip", node: <Spaces /> },
  { key: "1", seconds: 5.5, cut: "zoom", node: <Traditional /> },
  { key: "2", seconds: 6.0, cut: "flash", node: <Turn /> },
  { key: "3", seconds: 2.6, cut: "zoom", node: <TitleCard /> },
  { key: "4", seconds: 6.5, cut: "whip", node: <Login /> },
  { key: "5", seconds: 5.5, cut: "whip", node: <Notices /> },
  { key: "6", seconds: 6.0, cut: "zoom", node: <Profiles /> },
  { key: "7", seconds: 4.0, cut: "whip", node: <Hours /> },
  { key: "8", seconds: 5.0, cut: "zoom", node: <LibraryPeak /> },
  { key: "9", seconds: 5.0, cut: "flash", node: <HeatIntro /> },
  { key: "10", seconds: 6.0, cut: "zoom", node: <HeatDay /> },
  { key: "11", seconds: 4.2, cut: "whip", node: <Survey /> },
  { key: "12", seconds: 4.0, cut: "zoom", node: <Results /> },
  { key: "13", seconds: 5.0, cut: "whip", node: <Compare /> },
  { key: "14", seconds: 5.5, cut: "zoom", node: <Decision /> },
  { key: "fim", seconds: 5.0, cut: "flash", node: <Outro /> },
  { key: "assinatura", seconds: 4.8, cut: "whip", node: <Demo /> },
]);
