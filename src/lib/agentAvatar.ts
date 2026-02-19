import type { Agent } from "@/types/agent";

type Tone = NonNullable<Agent["tone"]>;

const tonePalette: Record<
  Tone,
  { bgA: string; bgB: string; frame: string; accent: string }
> = {
  professional: {
    bgA: "#0f172a",
    bgB: "#1d4ed8",
    frame: "#1e293b",
    accent: "#60a5fa",
  },
  friendly: {
    bgA: "#0f172a",
    bgB: "#0d9488",
    frame: "#0f766e",
    accent: "#5eead4",
  },
  consultative: {
    bgA: "#111827",
    bgB: "#4338ca",
    frame: "#312e81",
    accent: "#a5b4fc",
  },
  energetic: {
    bgA: "#1f2937",
    bgB: "#ea580c",
    frame: "#9a3412",
    accent: "#fdba74",
  },
  luxury: {
    bgA: "#1f2937",
    bgB: "#a16207",
    frame: "#78350f",
    accent: "#fcd34d",
  },
};

const hashString = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getVoiceStyle = (voice?: string) => {
  const normalized = (voice || "").toLowerCase();
  if (normalized.includes("female")) {
    return {
      eye: "#f9a8d4",
      mouth: "#fda4af",
      antenna: "#f472b6",
      headRadius: 20,
      browOffset: -8,
    };
  }
  if (normalized.includes("male")) {
    return {
      eye: "#93c5fd",
      mouth: "#67e8f9",
      antenna: "#38bdf8",
      headRadius: 16,
      browOffset: -10,
    };
  }
  return {
    eye: "#cbd5e1",
    mouth: "#94a3b8",
    antenna: "#64748b",
    headRadius: 18,
    browOffset: -9,
  };
};

const initials = (name?: string): string => {
  if (!name) return "AI";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const createAgentRobotAvatar = (
  agent: Pick<Agent, "name" | "voice" | "tone" | "avatar">
): string => {
  const tone = (agent.tone || "professional") as Tone;
  const palette = tonePalette[tone] || tonePalette.professional;
  const voice = getVoiceStyle(agent.voice);
  const seed = hashString(
    `${agent.name || ""}-${agent.voice || ""}-${agent.tone || ""}`
  );
  const eyeSpread = 8 + (seed % 4);
  const mouthWidth = 10 + (seed % 8);
  const cheek = seed % 2 === 0;
  const label = (agent.avatar || initials(agent.name || "")).slice(0, 2).toUpperCase();

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.bgA}" />
      <stop offset="100%" stop-color="${palette.bgB}" />
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#bg)" />
  <rect x="18" y="18" width="92" height="92" rx="24" fill="${palette.frame}" opacity="0.62" />
  <line x1="64" y1="14" x2="64" y2="28" stroke="${voice.antenna}" stroke-width="4" stroke-linecap="round" />
  <circle cx="64" cy="12" r="6" fill="${voice.antenna}" />
  <rect x="28" y="34" width="72" height="52" rx="${voice.headRadius}" fill="#0b1220" />
  <path d="M40 ${50 + voice.browOffset} Q52 ${44 + voice.browOffset} 64 ${50 + voice.browOffset}" stroke="${voice.eye}" stroke-width="3" fill="none" stroke-linecap="round" />
  <circle cx="${64 - eyeSpread}" cy="58" r="5" fill="${voice.eye}" />
  <circle cx="${64 + eyeSpread}" cy="58" r="5" fill="${voice.eye}" />
  ${cheek ? `<circle cx="${64 - eyeSpread - 8}" cy="67" r="3" fill="${voice.mouth}" opacity="0.5" />
  <circle cx="${64 + eyeSpread + 8}" cy="67" r="3" fill="${voice.mouth}" opacity="0.5" />` : ""}
  <rect x="${64 - Math.floor(mouthWidth / 2)}" y="72" width="${mouthWidth}" height="5" rx="2.5" fill="${voice.mouth}" />
  <text x="64" y="102" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${palette.accent}">${label}</text>
</svg>`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
