import type { GitHubProfile } from "./github";
import type { CardQuery } from "./query";
import type { LanguageSummary, PerformanceSummary, StatsSummary } from "./metrics";

type Theme = {
  readonly background: string;
  readonly surface: string;
  readonly surfaceStrong: string;
  readonly border: string;
  readonly text: string;
  readonly muted: string;
  readonly accent: string;
  readonly accentSoft: string;
  readonly track: string;
};

export type RenderOptions = Pick<CardQuery, "theme" | "title" | "hide_border" | "color">;

const themes: Record<CardQuery["theme"], Theme> = {
  github: {
    background: "#ffffff",
    surface: "#f6f8fa",
    surfaceStrong: "#eef4ff",
    border: "#d0d7de",
    text: "#24292f",
    muted: "#57606a",
    accent: "#0969da",
    accentSoft: "#ddf4ff",
    track: "#eaeef2",
  },
  dark: {
    background: "#0d1117",
    surface: "#161b22",
    surfaceStrong: "#1f2937",
    border: "#30363d",
    text: "#f0f6fc",
    muted: "#8b949e",
    accent: "#2f81f7",
    accentSoft: "#102a43",
    track: "#21262d",
  },
  light: {
    background: "#fafbfc",
    surface: "#ffffff",
    surfaceStrong: "#f3fdf5",
    border: "#e1e4e8",
    text: "#24292e",
    muted: "#586069",
    accent: "#2da44e",
    accentSoft: "#dcffe4",
    track: "#e1e4e8",
  },
  tokyonight: {
    background: "#1a1b27",
    surface: "#222436",
    surfaceStrong: "#2b3046",
    border: "#292e42",
    text: "#c0caf5",
    muted: "#9aa5ce",
    accent: "#7aa2f7",
    accentSoft: "#292e42",
    track: "#292e42",
  },
};

export function renderStatsCard(profile: GitHubProfile, stats: StatsSummary, options: RenderOptions): string {
  const rows = [
    ["Repos", formatNumber(stats.publicRepos)],
    ["Stars", formatNumber(stats.totalStars)],
    ["Forks", formatNumber(stats.totalForks)],
    [profile.source === "public" ? "Public" : "Contribs", profile.source === "public" ? profile.source : formatNumber(stats.contributions)],
    ["Followers", formatNumber(stats.followers)],
    ["Following", formatNumber(stats.following)],
  ] as const;

  return renderBaseCard({
    width: 480,
    height: 310,
    title: options.title ?? `${profile.username}'s GitHub Stats`,
    options,
    badge: profile.source === "public" ? "public data" : profile.source === "private" ? "private data" : "token data",
    body: ({ theme }) =>
      rows
        .map(([label, value], index) => {
          const column = index % 2;
          const row = Math.floor(index / 2);
          const x = 32 + column * 216;
          const y = 94 + row * 60;
          const delay = 0.1 + index * 0.05;
          return `
            <g class="animate-fade-in" style="animation-delay: ${delay}s; opacity: 0;">
              <rect x="${x}" y="${y}" width="200" height="50" rx="10" fill="${theme.surface}" stroke="${theme.border}" filter="url(#shadow-sm)" />
              <circle cx="${x + 20}" cy="${y + 25}" r="5" fill="${theme.accent}" />
              <text x="${x + 36}" y="${y + 29}" class="metric-label">${escapeXml(label)}</text>
              <text x="${x + 186}" y="${y + 29}" text-anchor="end" class="metric-value">${escapeXml(value)}</text>
            </g>
          `;
        })
        .join(""),
    footer: () =>
      `<text x="32" y="290" class="tiny animate-fade-in" style="animation-delay: 0.4s; opacity: 0;">${profile.source === "public" ? "Uses public GitHub REST data without a token" : profile.source === "private" ? "Includes private repositories visible to the token" : "Uses authenticated GitHub GraphQL data"}</text>`,
  });
}

export function renderAllCard(
  profile: GitHubProfile,
  stats: StatsSummary,
  languages: readonly LanguageSummary[],
  performance: PerformanceSummary,
  options: RenderOptions,
): string {
  const statItems = [
    ["Repos", formatNumber(stats.publicRepos)],
    ["Stars", formatNumber(stats.totalStars)],
    ["Forks", formatNumber(stats.totalForks)],
    ["Followers", formatNumber(stats.followers)],
  ] as const;
  
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (performance.score / 100) * circumference;

  return renderBaseCard({
    width: 520,
    height: 530,
    title: options.title ?? `${profile.username}'s GitHub Overview`,
    options,
    badge: profile.source === "public" ? "public profile" : "full profile",
    body: ({ theme }) => {
      const statTiles = statItems
        .map(([label, value], index) => {
          const x = 32 + index * 117; 
          const delay = 0.1 + index * 0.05;
          return `
            <g class="animate-fade-in" style="animation-delay: ${delay}s; opacity: 0;">
              <rect x="${x}" y="94" width="105" height="72" rx="12" fill="${theme.surface}" stroke="${theme.border}" filter="url(#shadow-sm)" />
              <text x="${x + 52.5}" y="124" text-anchor="middle" class="metric-label">${escapeXml(label)}</text>
              <text x="${x + 52.5}" y="152" text-anchor="middle" class="hero-value">${escapeXml(value)}</text>
            </g>
          `;
        }).join("");
      
      const languageBlock = languages.length > 0
          ? renderGridLanguages(languages, theme, 56, 240, 408)
          : `<text x="56" y="260" class="muted">${escapeXml(profile.username)} has no language data yet.</text>`;

      return `
        <g class="animate-fade-in" style="animation-delay: 0.1s; opacity: 0;">
          <text x="32" y="68" class="subtitle">${profile.source === "public" ? "Public GitHub profile signals" : "Authenticated GitHub profile signals"}</text>
        </g>
        
        ${statTiles}
        
        <g class="animate-fade-in" style="animation-delay: 0.3s; opacity: 0;">
          <rect x="32" y="186" width="456" height="136" rx="16" fill="${theme.surfaceStrong}" stroke="${theme.border}" filter="url(#shadow-sm)" />
          <text x="56" y="222" class="section-title">Top Languages</text>
          ${languageBlock}
        </g>

        <g class="animate-fade-in" style="animation-delay: 0.4s; opacity: 0;">
          <rect x="32" y="342" width="456" height="136" rx="16" fill="${theme.surface}" stroke="${theme.border}" filter="url(#shadow-sm)" />
          <text x="56" y="378" class="section-title">Performance</text>
          
          <circle cx="106" cy="432" r="${radius}" fill="none" stroke="${theme.track}" stroke-width="12" />
          <circle
            cx="106"
            cy="432"
            r="${radius}"
            fill="none"
            stroke="${theme.accent}"
            stroke-width="12"
            stroke-linecap="round"
            class="animate-circle"
            stroke-dasharray="${circumference.toFixed(2)}"
            style="--target-offset: ${dashOffset.toFixed(2)}; stroke-dashoffset: ${circumference.toFixed(2)};"
            transform="rotate(-90 106 432)"
            filter="url(#glow)"
          />
          <text x="106" y="440" text-anchor="middle" class="score-large">${performance.score}</text>
          
          <text x="176" y="402" class="metric-label">Status</text>
          <text x="464" y="402" text-anchor="end" class="metric-value">${escapeXml(performance.label)}</text>
          
          <text x="176" y="430" class="metric-label">Active repositories</text>
          <text x="464" y="430" text-anchor="end" class="metric-value">${formatNumber(performance.activeRepos)}</text>
          
          <text x="176" y="458" class="metric-label">Contributions</text>
          <text x="464" y="458" text-anchor="end" class="metric-value">${profile.source === "public" ? "Requires Token" : formatNumber(performance.contributionEvents)}</text>
        </g>

        <text x="32" y="506" class="tiny animate-fade-in" style="animation-delay: 0.5s; opacity: 0;">${profile.source === "public" ? "No token required. Uses public GitHub REST data." : "Uses authenticated GitHub GraphQL data."}</text>
      `;
    },
  });
}

export function renderLanguagesCard(
  profile: GitHubProfile,
  languages: readonly LanguageSummary[],
  options: RenderOptions,
): string {
  if (languages.length === 0) {
    return renderErrorCard("No language data found yet.", 404, options);
  }

  return renderBaseCard({
    width: 480,
    height: 250,
    title: options.title ?? "Top Languages",
    options,
    badge: profile.source === "public" ? "public data" : "token data",
    body: ({ theme }) => `
      <g class="animate-fade-in" style="animation-delay: 0.1s; opacity: 0;">
        <rect x="32" y="94" width="416" height="124" rx="12" fill="${theme.surfaceStrong}" stroke="${theme.border}" filter="url(#shadow-sm)" />
        ${renderGridLanguages(languages, theme, 48, 120, 384)}
      </g>
    `,
  });
}

export function renderPerformanceCard(
  profile: GitHubProfile,
  performance: PerformanceSummary,
  options: RenderOptions,
): string {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (performance.score / 100) * circumference;

  return renderBaseCard({
    width: 480,
    height: 240,
    title: options.title ?? `${profile.username}'s Performance`,
    options,
    badge: profile.source === "public" ? "public score" : "activity score",
    body: ({ theme }) => `
      <g class="animate-fade-in" style="animation-delay: 0.1s; opacity: 0;">
        <rect x="32" y="90" width="416" height="118" rx="12" fill="${theme.surface}" stroke="${theme.border}" filter="url(#shadow-sm)" />
        <circle cx="102" cy="149" r="${radius}" fill="none" stroke="${theme.track}" stroke-width="12" />
        <circle
          cx="102"
          cy="149"
          r="${radius}"
          fill="none"
          stroke="${theme.accent}"
          stroke-width="12"
          stroke-linecap="round"
          class="animate-circle"
          stroke-dasharray="${circumference.toFixed(2)}"
          style="--target-offset: ${dashOffset.toFixed(2)}; stroke-dashoffset: ${circumference.toFixed(2)};"
          transform="rotate(-90 102 149)"
          filter="url(#glow)"
        />
        <text x="102" y="158" text-anchor="middle" class="score-large">${performance.score}</text>
        
        <text x="176" y="126" class="metric-label">Status</text>
        <text x="424" y="126" text-anchor="end" class="metric-value">${escapeXml(performance.label)}</text>
        <text x="176" y="154" class="metric-label">Active repos</text>
        <text x="424" y="154" text-anchor="end" class="metric-value">${formatNumber(performance.activeRepos)}</text>
        <text x="176" y="182" class="metric-label">Contributions</text>
        <text x="424" y="182" text-anchor="end" class="metric-value">${profile.source === "public" ? "Requires Token" : formatNumber(performance.contributionEvents)}</text>
      </g>
    `,
  });
}

export function renderErrorCard(message: string, status: number, options?: Partial<RenderOptions>): string {
  return renderBaseCard({
    width: 480,
    height: 145,
    title: options?.title ?? "GitHub Stats Error",
    options: {
      theme: options?.theme ?? "github",
      title: options?.title,
      hide_border: options?.hide_border ?? false,
      color: options?.color,
    },
    body: () => `<text x="32" y="96" class="muted animate-fade-in">${escapeXml(message)} (Status: ${status})</text>`,
  });
}

function renderBaseCard(input: {
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly options: RenderOptions;
  readonly badge?: string;
  readonly body: (input: { readonly theme: Theme }) => string;
  readonly footer?: (input: { readonly theme: Theme }) => string;
}): string {
  const theme = withAccent(themes[input.options.theme], input.options.color);
  const border = input.options.hide_border
    ? ""
    : `<rect x="0.5" y="0.5" width="${input.width - 1}" height="${input.height - 1}" rx="16" fill="none" stroke="${theme.border}" opacity="0.8" />`;

  return `
    <svg width="${input.width}" height="${input.height}" viewBox="0 0 ${input.width} ${input.height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(input.title)}">
      <defs>
        <clipPath id="card-clip">
          <rect width="${input.width}" height="${input.height}" rx="16" />
        </clipPath>
        <filter id="shadow-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.05"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${theme.accent}" flood-opacity="0.4"/>
        </filter>
        <filter id="bg-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <style>
        * { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .title { fill: ${theme.text}; font-weight: 700; font-size: 20px; letter-spacing: -0.5px; }
        .subtitle { fill: ${theme.muted}; font-weight: 500; font-size: 13px; }
        .muted { fill: ${theme.muted}; font-weight: 400; font-size: 13px; }
        .metric-label { fill: ${theme.muted}; font-weight: 500; font-size: 12px; }
        .metric-value { fill: ${theme.text}; font-weight: 700; font-size: 14px; }
        .tiny { fill: ${theme.muted}; font-weight: 400; font-size: 11px; }
        .badge { fill: ${theme.accent}; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
        .score-large { fill: ${theme.text}; font-weight: 800; font-size: 26px; letter-spacing: -1px; }
        .hero-value { fill: ${theme.text}; font-weight: 800; font-size: 22px; letter-spacing: -0.5px; }
        .section-title { fill: ${theme.text}; font-weight: 700; font-size: 14px; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: var(--target-offset); }
        }
        @keyframes growX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-circle { animation: drawCircle 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.3s; }
        .animate-grow-x { animation: growX 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      </style>
      
      <g clip-path="url(#card-clip)">
        <rect width="${input.width}" height="${input.height}" fill="${theme.background}" />
        
        <rect x="0" y="0" width="${input.width}" height="6" fill="${theme.accent}" opacity="0.9" />
        
        <circle cx="${input.width}" cy="0" r="110" fill="${theme.accentSoft}" opacity="0.6" filter="url(#bg-blur)" />
        <circle cx="${input.width}" cy="0" r="60" fill="${theme.accent}" opacity="0.2" filter="url(#bg-blur)" />
        
        <g class="animate-fade-in" style="animation-delay: 0s; opacity: 0;">
          <text x="32" y="46" class="title">${escapeXml(input.title)}</text>
          ${input.badge ? renderBadge(input.badge, theme, input.width) : ""}
        </g>
        
        ${input.body({ theme })}
        ${input.footer?.({ theme }) ?? ""}
      </g>
      
      ${border}
    </svg>
  `.trim();
}

function renderGridLanguages(
  languages: readonly LanguageSummary[],
  theme: Theme,
  x: number,
  y: number,
  width: number,
): string {
  const total = languages.reduce((sum, language) => sum + language.percentage, 0);
  let offset = 0;
  
  const bar = languages
    .map((language) => {
      const segmentWidth = total > 0 ? Math.max(3, (language.percentage / total) * width) : 0;
      const segment = `<rect x="${x + offset}" y="${y}" width="${segmentWidth}" height="10" rx="5" fill="${escapeXml(language.color)}" class="animate-grow-x" style="transform-origin: ${x + offset}px 0;" />`;
      offset += segmentWidth;
      return segment;
    })
    .join("");
    
  const rows = languages
    .slice(0, 4)
    .map((language, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const itemX = x + col * (width / 2 + 10);
      const itemY = y + 36 + row * 26;
      const delay = 0.3 + index * 0.1;

      return `
        <g class="animate-fade-in" style="animation-delay: ${delay}s; opacity: 0;">
          <circle cx="${itemX + 6}" cy="${itemY - 4}" r="6" fill="${escapeXml(language.color)}" />
          <text x="${itemX + 20}" y="${itemY}" class="metric-label">${escapeXml(language.name)}</text>
          <text x="${itemX + (width / 2 - 20)}" y="${itemY}" text-anchor="end" class="metric-value">${language.percentage.toFixed(1)}%</text>
        </g>
      `;
    })
    .join("");

  return `
    <rect x="${x}" y="${y}" width="${width}" height="10" rx="5" fill="${theme.track}" />
    ${bar}
    ${rows}
  `;
}

function withAccent(theme: Theme, color?: string): Theme {
  return {
    ...theme,
    accent: color ?? theme.accent,
  };
}

function renderBadge(label: string, theme: Theme, canvasWidth: number): string {
  const badgeWidth = Math.max(84, label.length * 7 + 26);
  const x = canvasWidth - badgeWidth - 32;

  return `
    <rect x="${x}" y="28" width="${badgeWidth}" height="24" rx="12" fill="${theme.accentSoft}" stroke="${theme.border}" />
    <text x="${x + badgeWidth / 2}" y="44" text-anchor="middle" class="badge">${escapeXml(label)}</text>
  `;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: value >= 10_000 ? "compact" : "standard",
  }).format(value);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}