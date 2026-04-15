import type { GitHubProfile } from "./github";
import type { CardQuery } from "./query";
import type { LanguageSummary, PerformanceSummary, StatsSummary } from "./metrics";

type Theme = {
  readonly background: string;
  readonly backgroundGrad: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly surfaceStrong: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly text: string;
  readonly textBright: string;
  readonly muted: string;
  readonly accent: string;
  readonly accentMid: string;
  readonly accentSoft: string;
  readonly accentGlow: string;
  readonly track: string;
  readonly shadow: string;
  readonly iconFill: string;
};

export type RenderOptions = Pick<CardQuery, "theme" | "title" | "hide_border" | "color">;

const themes: Record<CardQuery["theme"], Theme> = {
  github: {
    background: "#ffffff",
    backgroundGrad: "#f3f6fb",
    surface: "#f6f8fa",
    surfaceAlt: "#eef2f8",
    surfaceStrong: "#e8f0fe",
    border: "#d0d7de",
    borderStrong: "#b0bbc7",
    text: "#24292f",
    textBright: "#0d1117",
    muted: "#6e7781",
    accent: "#0969da",
    accentMid: "#388bfd",
    accentSoft: "#dbeafe",
    accentGlow: "#0969da22",
    track: "#e5eaf0",
    shadow: "#0d111722",
    iconFill: "#0969da",
  },
  dark: {
    background: "#0d1117",
    backgroundGrad: "#111827",
    surface: "#161b22",
    surfaceAlt: "#1c2433",
    surfaceStrong: "#1f2937",
    border: "#30363d",
    borderStrong: "#484f58",
    text: "#e6edf3",
    textBright: "#f0f6fc",
    muted: "#8b949e",
    accent: "#58a6ff",
    accentMid: "#79c0ff",
    accentSoft: "#1d3557",
    accentGlow: "#58a6ff1a",
    track: "#21262d",
    shadow: "#00000066",
    iconFill: "#58a6ff",
  },
  light: {
    background: "#f6f8fa",
    backgroundGrad: "#edf2fb",
    surface: "#ffffff",
    surfaceAlt: "#f0fdf4",
    surfaceStrong: "#dcfce7",
    border: "#d1d9e0",
    borderStrong: "#a8b8c2",
    text: "#1f2328",
    textBright: "#111827",
    muted: "#656d76",
    accent: "#1a7f37",
    accentMid: "#2da44e",
    accentSoft: "#d1fae5",
    accentGlow: "#1a7f3720",
    track: "#d1d9e0",
    shadow: "#1f232811",
    iconFill: "#1a7f37",
  },
  tokyonight: {
    background: "#1a1b27",
    backgroundGrad: "#16172b",
    surface: "#222436",
    surfaceAlt: "#2a2d48",
    surfaceStrong: "#292e42",
    border: "#3b4261",
    borderStrong: "#565f89",
    text: "#c0caf5",
    textBright: "#e1e5f4",
    muted: "#9aa5ce",
    accent: "#7aa2f7",
    accentMid: "#89b4fa",
    accentSoft: "#2d355f",
    accentGlow: "#7aa2f72a",
    track: "#292e42",
    shadow: "#00000055",
    iconFill: "#7aa2f7",
  },
};

// ─── SVG Icon Paths ──────────────────────────────────────────────────────────
const icons = {
  star: `M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z`,
  fork: `M5 3a2 2 0 100 4 2 2 0 000-4zm0 6a4 4 0 010-8 4 4 0 010 8zm0 2a6 6 0 00-6 6v1h2v-1a4 4 0 018 0v1h2v-1a6 6 0 00-6-6zm9-8a2 2 0 100 4 2 2 0 000-4zm0 6a4 4 0 010-8 4 4 0 010 8zM9.732 15H14a6 6 0 016 6v1h-2v-1a4 4 0 00-4-4H9.732a4.002 4.002 0 01-7.464 0H0v-1a6 6 0 016-6 6 6 0 013.732 1zm0 0`,
  repo: `M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v14h16V5H4zm4 2h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z`,
  user: `M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z`,
  follow: `M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z`,
  contrib: `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z`,
  chart: `M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z`,
  lightning: `M7 2v11h3v9l7-12h-4l4-8z`,
  language: `M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z`,
};

// ─── Stats Card ──────────────────────────────────────────────────────────────
export function renderStatsCard(profile: GitHubProfile, stats: StatsSummary, options: RenderOptions): string {
  const rows: Array<[string, string, string, keyof typeof icons]> = [
    ["Public Repos", formatNumber(stats.publicRepos), "repositories", "repo"],
    ["Total Stars", formatNumber(stats.totalStars), "stars earned", "star"],
    ["Total Forks", formatNumber(stats.totalForks), "repository forks", "fork"],
    [
      profile.source === "public" ? "Data Source" : "Contributions",
      profile.source === "public" ? "Public" : formatNumber(stats.contributions),
      profile.source === "public" ? "no token required" : "yearly commits",
      "contrib",
    ],
    ["Followers", formatNumber(stats.followers), "github followers", "follow"],
    ["Following", formatNumber(stats.following), "accounts followed", "user"],
  ];

  return renderBaseCard({
    height: 300,
    title: options.title ?? `${profile.username}'s GitHub Stats`,
    options,
    badge: profile.source === "public" ? "public" : profile.source === "private" ? "private" : "auth",
    body: ({ theme, id }) => {
      const cards = rows
        .map(([label, value, desc, icon], index) => {
          const col = index % 2;
          const row = Math.floor(index / 2);
          const x = 20 + col * 196;
          const y = 72 + row * 66;
          const gid = `${id}_s${index}`;
          return `
            <defs>
              <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${theme.surface}" />
                <stop offset="100%" stop-color="${theme.surfaceAlt}" />
              </linearGradient>
            </defs>
            <rect x="${x}" y="${y}" width="182" height="54" rx="10" fill="url(#${gid})" stroke="${theme.border}" stroke-width="1" />
            <rect x="${x}" y="${y}" width="3" height="54" rx="2" fill="${theme.accent}" />
            <g transform="translate(${x + 14}, ${y + 14}) scale(0.7)">
              <path d="${icons[icon]}" fill="${theme.accent}" />
            </g>
            <text x="${x + 31}" y="${y + 19}" class="card-label">${escapeXml(label)}</text>
            <text x="${x + 31}" y="${y + 40}" class="card-value">${escapeXml(value)}</text>
            <text x="${x + 174}" y="${y + 40}" text-anchor="end" class="card-sub">${escapeXml(desc)}</text>
          `;
        })
        .join("");

      const footerNote =
        profile.source === "public"
          ? "Public GitHub REST — no token required"
          : profile.source === "private"
            ? "Includes private repos visible to your token"
            : "Authenticated via GitHub GraphQL";

      return `
        ${cards}
        <line x1="20" y1="270" x2="400" y2="270" stroke="${theme.border}" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" />
        <text x="20" y="288" class="footer-note">${escapeXml(footerNote)}</text>
      `;
    },
  });
}

// ─── Language Card ───────────────────────────────────────────────────────────
export function renderLanguagesCard(
  profile: GitHubProfile,
  languages: readonly LanguageSummary[],
  options: RenderOptions,
): string {
  if (languages.length === 0) {
    return renderMessageCard(options, options.title ?? "Top Languages", `${profile.username} has no language data yet.`);
  }

  const cardHeight = 58 + 16 + 20 + languages.length * 34 + 28;

  return renderBaseCard({
    height: cardHeight,
    title: options.title ?? "Top Languages",
    options,
    badge: profile.source === "public" ? "public" : profile.source === "private" ? "private" : "auth",
    body: ({ theme, id }) => {
      const total = languages.reduce((sum, l) => sum + l.percentage, 0);
      let offset = 0;

      // Segmented progress bar
      const barY = 66;
      const barWidth = 380;
      const barX = 20;
      const barHeight = 10;

      const bar = languages
        .map((lang) => {
          const w = total > 0 ? Math.max(4, (lang.percentage / total) * barWidth) : 0;
          const seg = `<rect x="${barX + offset}" y="${barY}" width="${w}" height="${barHeight}" fill="${escapeXml(lang.color)}" />`;
          offset += w;
          return seg;
        })
        .join("");

      // Clipped bar
      const barClipId = `${id}_barclip`;

      const rows = languages
        .map((lang, i) => {
          const ry = barY + barHeight + 18 + i * 34;
          const pct = total > 0 ? lang.percentage / total : 0;
          const fillW = Math.max(4, pct * barWidth);
          const pid = `${id}_lang${i}`;
          return `
            <circle cx="${barX + 9}" cy="${ry + 9}" r="6" fill="${escapeXml(lang.color)}" />
            <text x="${barX + 24}" y="${ry + 13}" class="lang-name">${escapeXml(lang.name)}</text>
            <rect x="${barX + 140}" y="${ry + 2}" width="${barWidth - 140 + barX}" height="8" rx="4" fill="${theme.track}" />
            <rect x="${barX + 140}" y="${ry + 2}" width="${Math.min(fillW * 0.7, barWidth - 140 + barX)}" height="8" rx="4" fill="${escapeXml(lang.color)}" opacity="0.85" />
            <defs>
              <linearGradient id="${pid}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${escapeXml(lang.color)}" stop-opacity="1" />
                <stop offset="100%" stop-color="${escapeXml(lang.color)}" stop-opacity="0.5" />
              </linearGradient>
            </defs>
            <text x="${barX + barWidth}" y="${ry + 13}" text-anchor="end" class="lang-pct">${lang.percentage.toFixed(1)}%</text>
          `;
        })
        .join("");

      return `
        <defs>
          <clipPath id="${barClipId}">
            <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5" />
          </clipPath>
        </defs>
        <rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5" fill="${theme.track}" />
        <g clip-path="url(#${barClipId})">${bar}</g>
        ${rows}
      `;
    },
  });
}

// ─── Performance Card ────────────────────────────────────────────────────────
export function renderPerformanceCard(
  profile: GitHubProfile,
  performance: PerformanceSummary,
  options: RenderOptions,
): string {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (performance.score / 100) * circumference;

  const rows: Array<[string, string, keyof typeof icons]> = [
    ["Status", performance.label, "chart"],
    ["Active Repos", formatNumber(performance.activeRepos), "repo"],
    [
      profile.source === "public" ? "Public Signal" : "Contributions",
      profile.source === "public" ? "Repos" : formatNumber(performance.contributionEvents),
      "contrib",
    ],
    ["Collaboration", formatNumber(performance.collaborationEvents), "follow"],
  ];

  return renderBaseCard({
    height: 248,
    title: options.title ?? `${profile.username}'s Performance`,
    options,
    badge: profile.source === "public" ? "public score" : profile.source === "private" ? "private score" : "act. score",
    body: ({ theme, id }) => {
      const glowId = `${id}_glow`;
      const gradId = `${id}_grad`;
      const trackGradId = `${id}_tgrad`;

      return `
        <defs>
          <radialGradient id="${glowId}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.18" />
            <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.surface}" />
            <stop offset="100%" stop-color="${theme.surfaceAlt}" />
          </linearGradient>
          <linearGradient id="${trackGradId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.accent}" />
            <stop offset="100%" stop-color="${theme.accentMid}" />
          </linearGradient>
        </defs>

        <!-- Score ring panel -->
        <rect x="20" y="68" width="140" height="148" rx="12" fill="url(#${gradId})" stroke="${theme.border}" stroke-width="1" />
        <circle cx="90" cy="142" r="72" fill="url(#${glowId})" />
        <circle cx="90" cy="142" r="${radius}" fill="none" stroke="${theme.track}" stroke-width="10" stroke-linecap="round" />
        <circle
          cx="90" cy="142" r="${radius}"
          fill="none"
          stroke="url(#${trackGradId})"
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${dashOffset.toFixed(2)}"
          transform="rotate(-90 90 142)"
        />
        <text x="90" y="135" text-anchor="middle" class="score-num">${performance.score}</text>
        <text x="90" y="155" text-anchor="middle" class="score-lbl">/ 100</text>

        <!-- Stat rows -->
        ${rows
          .map(([label, value, icon], i) => {
            const ry = 80 + i * 36;
            return `
              <g transform="translate(176, ${ry}) scale(0.65)">
                <path d="${icons[icon]}" fill="${theme.accent}" opacity="0.8" />
              </g>
              <text x="196" y="${ry + 11}" class="perf-label">${escapeXml(label)}</text>
              <text x="400" y="${ry + 11}" text-anchor="end" class="perf-value">${escapeXml(value)}</text>
              <line x1="196" y1="${ry + 16}" x2="400" y2="${ry + 16}" stroke="${theme.border}" stroke-width="0.5" opacity="0.5" />
            `;
          })
          .join("")}
      `;
    },
  });
}

// ─── All / Overview Card ─────────────────────────────────────────────────────
export function renderAllCard(
  profile: GitHubProfile,
  stats: StatsSummary,
  languages: readonly LanguageSummary[],
  performance: PerformanceSummary,
  options: RenderOptions,
): string {
  const statItems: Array<[string, string, string, keyof typeof icons]> = [
    ["Repositories", formatNumber(stats.publicRepos), "public", "repo"],
    ["Stars", formatNumber(stats.totalStars), "earned", "star"],
    ["Forks", formatNumber(stats.totalForks), "created", "fork"],
    ["Followers", formatNumber(stats.followers), "people", "follow"],
  ];

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (performance.score / 100) * circumference;

  return renderBaseCard({
    width: 920,
    height: 374,
    title: options.title ?? `${profile.username}'s GitHub Overview`,
    options,
    badge: profile.source === "public" ? "public" : profile.source === "private" ? "private" : "full",
    body: ({ theme, id }) => {
      // Stat tiles (2x2 grid, left column)
      const tiles = statItems
        .map(([label, value, unit, icon], i) => {
          const tx = 20 + (i % 2) * 144;
          const ty = 100 + Math.floor(i / 2) * 84;
          const tgId = `${id}_t${i}`;
          return `
            <defs>
              <linearGradient id="${tgId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${theme.surface}" />
                <stop offset="100%" stop-color="${theme.surfaceAlt}" />
              </linearGradient>
            </defs>
            <rect x="${tx}" y="${ty}" width="130" height="68" rx="10" fill="url(#${tgId})" stroke="${theme.border}" stroke-width="1" />
            <g transform="translate(${tx + 10}, ${ty + 10}) scale(0.7)">
              <path d="${icons[icon]}" fill="${theme.accent}" />
            </g>
            <text x="${tx + 12}" y="${ty + 44}" class="tile-value">${escapeXml(value)}</text>
            <text x="${tx + 12}" y="${ty + 59}" class="tile-sub">${escapeXml(label)} · ${escapeXml(unit)}</text>
          `;
        })
        .join("");

      // Profile section (top-left)
      const profileBlock = `
        <text x="20" y="72" class="overview-name">${escapeXml(profile.name ?? profile.username)}</text>
        <text x="20" y="90" class="overview-sub">${profile.source === "public" ? "Public GitHub Profile" : profile.source === "private" ? "Private Repository Access" : "Authenticated GitHub Profile"}</text>
      `;

      // Languages panel (center)
      const langPanel =
        languages.length > 0
          ? renderWideLanguages(languages, theme, 316, 110, 288, id)
          : `<text x="340" y="180" class="muted">${escapeXml(profile.username)} — no language data.</text>`;

      // Performance panel (right)
      const perfGlowId = `${id}_pglow`;
      const perfGradId = `${id}_pgrad`;
      const perfTrackId = `${id}_ptgrad`;
      const perfPanel = `
        <defs>
          <radialGradient id="${perfGlowId}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.2" />
            <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="${perfGradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${theme.surface}" />
            <stop offset="100%" stop-color="${theme.surfaceAlt}" />
          </linearGradient>
          <linearGradient id="${perfTrackId}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.accent}" />
            <stop offset="100%" stop-color="${theme.accentMid}" />
          </linearGradient>
        </defs>
        <rect x="688" y="94" width="212" height="240" rx="12" fill="url(#${perfGradId})" stroke="${theme.border}" stroke-width="1" />
        <text x="710" y="122" class="panel-header">Performance</text>
        <circle cx="794" cy="207" r="72" fill="url(#${perfGlowId})" />
        <circle cx="794" cy="207" r="${radius}" fill="none" stroke="${theme.track}" stroke-width="10" stroke-linecap="round" />
        <circle
          cx="794" cy="207" r="${radius}"
          fill="none"
          stroke="url(#${perfTrackId})"
          stroke-width="10"
          stroke-linecap="round"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${dashOffset.toFixed(2)}"
          transform="rotate(-90 794 207)"
        />
        <text x="794" y="200" text-anchor="middle" class="score-xl">${performance.score}</text>
        <text x="794" y="222" text-anchor="middle" class="score-tag">${escapeXml(performance.label)}</text>
        <text x="710" y="315" class="perf-label">Active repos</text>
        <text x="888" y="315" text-anchor="end" class="perf-value">${formatNumber(performance.activeRepos)}</text>
      `;

      // Divider lines
      const dividers = `
        <line x1="308" y1="94" x2="308" y2="334" stroke="${theme.border}" stroke-width="1" opacity="0.6" />
        <line x1="680" y1="94" x2="680" y2="334" stroke="${theme.border}" stroke-width="1" opacity="0.6" />
      `;

      const footer = profile.source === "public"
        ? "No token required — uses public GitHub REST data"
        : profile.source === "private"
          ? "Private mode — requires self-hosted token"
          : "Authenticated via GitHub GraphQL API";

      return `
        ${profileBlock}
        ${tiles}
        <rect x="316" y="94" width="356" height="240" rx="12" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1" />
        <text x="336" y="122" class="panel-header">Top Languages</text>
        ${langPanel}
        ${perfPanel}
        ${dividers}
        <line x1="20" y1="342" x2="900" y2="342" stroke="${theme.border}" stroke-width="1" stroke-dasharray="4 4" opacity="0.4" />
        <text x="20" y="362" class="footer-note">${escapeXml(footer)}</text>
      `;
    },
  });
}

// ─── Error Card ───────────────────────────────────────────────────────────────
export function renderErrorCard(message: string, status: number, options?: Partial<RenderOptions>): string {
  return renderMessageCard(
    {
      theme: options?.theme ?? "github",
      title: options?.title,
      hide_border: options?.hide_border ?? false,
      color: options?.color,
    },
    "GitHub Stats — Error",
    `${status}: ${message}`,
  );
}

// ─── Message Card ─────────────────────────────────────────────────────────────
function renderMessageCard(options: RenderOptions, title: string, message: string): string {
  return renderBaseCard({
    height: 148,
    title,
    options,
    body: ({ theme }) => `
      <rect x="20" y="72" width="380" height="48" rx="8" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1" />
      <text x="36" y="100" class="muted">${escapeXml(message)}</text>
    `,
  });
}

// ─── Wide Language Helper ────────────────────────────────────────────────────
function renderWideLanguages(
  languages: readonly LanguageSummary[],
  theme: Theme,
  x: number,
  y: number,
  width: number,
  id: string,
): string {
  const total = languages.reduce((sum, l) => sum + l.percentage, 0);
  let offset = 0;

  const clipId = `${id}_wlclip`;
  const bar = languages
    .map((lang) => {
      const w = total > 0 ? Math.max(4, (lang.percentage / total) * width) : 0;
      const seg = `<rect x="${x + offset}" y="${y}" width="${w}" height="10" fill="${escapeXml(lang.color)}" />`;
      offset += w;
      return seg;
    })
    .join("");

  const rows = languages
    .slice(0, 4)
    .map((lang, i) => {
      const ry = y + 28 + i * 44;
      const pct = total > 0 ? (lang.percentage / total) * 0.85 : 0;
      const fillW = Math.max(4, pct * width);
      return `
        <circle cx="${x + 9}" cy="${ry + 9}" r="6" fill="${escapeXml(lang.color)}" />
        <text x="${x + 24}" y="${ry + 14}" class="lang-name">${escapeXml(lang.name)}</text>
        <rect x="${x + 130}" y="${ry + 4}" width="${width - 170}" height="7" rx="3.5" fill="${theme.track}" />
        <rect x="${x + 130}" y="${ry + 4}" width="${Math.min(fillW * 0.55, width - 170)}" height="7" rx="3.5" fill="${escapeXml(lang.color)}" opacity="0.85" />
        <text x="${x + width}" y="${ry + 14}" text-anchor="end" class="lang-pct">${lang.percentage.toFixed(1)}%</text>
      `;
    })
    .join("");

  return `
    <defs>
      <clipPath id="${clipId}">
        <rect x="${x}" y="${y}" width="${width}" height="10" rx="5" />
      </clipPath>
    </defs>
    <rect x="${x}" y="${y}" width="${width}" height="10" rx="5" fill="${theme.track}" />
    <g clip-path="url(#${clipId})">${bar}</g>
    ${rows}
  `;
}

// ─── Base Card Renderer ───────────────────────────────────────────────────────
let _cardSeq = 0;

function renderBaseCard(input: {
  readonly width?: number;
  readonly height: number;
  readonly title: string;
  readonly options: RenderOptions;
  readonly badge?: string;
  readonly body: (input: { readonly theme: Theme; readonly id: string }) => string;
  readonly footer?: (input: { readonly theme: Theme; readonly id: string }) => string;
}): string {
  const id = `c${++_cardSeq}`;
  const width = input.width ?? 420;
  const theme = withAccent(themes[input.options.theme], input.options.color);

  const bgGradId = `${id}_bg`;
  const topGradId = `${id}_top`;
  const shadowId = `${id}_shadow`;

  const border = input.options.hide_border
    ? ""
    : `<rect x="0.5" y="0.5" width="${width - 1}" height="${input.height - 1}" rx="12" fill="none" stroke="${theme.border}" stroke-width="1" />`;

  const badge = input.badge ? renderBadge(input.badge, theme, width, id) : "";

  return `
<svg width="${width}" height="${input.height}" viewBox="0 0 ${width} ${input.height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(input.title)}" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="${bgGradId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.background}" />
      <stop offset="100%" stop-color="${theme.backgroundGrad}" />
    </linearGradient>
    <linearGradient id="${topGradId}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}" />
      <stop offset="60%" stop-color="${theme.accentMid}" />
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.4" />
    </linearGradient>
    <filter id="${shadowId}" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="${theme.shadow}" />
    </filter>
  </defs>

  <!-- Card base -->
  <rect width="${width}" height="${input.height}" rx="12" fill="url(#${bgGradId})" />
  ${border}

  <!-- Accent top bar -->
  <rect x="0" y="0" width="${width}" height="4" rx="2" fill="url(#${topGradId})" />

  <!-- Decorative blobs -->
  <circle cx="${width - 32}" cy="34" r="54" fill="${theme.accent}" opacity="0.05" />
  <circle cx="${width - 8}" cy="8" r="28" fill="${theme.accentMid}" opacity="0.07" />

  <!-- Title -->
  <text x="20" y="42" class="card-title">${escapeXml(input.title)}</text>
  ${badge}

  <!-- Body -->
  ${input.body({ theme, id })}

  ${input.footer?.({ theme, id }) ?? ""}

  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Helvetica Neue", Arial, sans-serif; }
    .card-title { fill: ${theme.textBright}; font-size: 15px; font-weight: 700; letter-spacing: -0.3px; }
    .card-label { fill: ${theme.muted}; font-size: 11px; font-weight: 500; }
    .card-value { fill: ${theme.text}; font-size: 16px; font-weight: 800; letter-spacing: -0.5px; }
    .card-sub   { fill: ${theme.muted}; font-size: 10px; font-weight: 400; }
    .badge-text { fill: ${theme.accent}; font-size: 10px; font-weight: 700; letter-spacing: 0.4px; }
    .muted      { fill: ${theme.muted}; font-size: 12px; font-weight: 400; }
    .footer-note { fill: ${theme.muted}; font-size: 10px; font-weight: 400; }
    .score-num  { fill: ${theme.textBright}; font-size: 30px; font-weight: 800; letter-spacing: -1px; }
    .score-lbl  { fill: ${theme.muted}; font-size: 11px; font-weight: 500; }
    .score-xl   { fill: ${theme.textBright}; font-size: 34px; font-weight: 800; letter-spacing: -1px; }
    .score-tag  { fill: ${theme.muted}; font-size: 11px; font-weight: 600; }
    .perf-label { fill: ${theme.muted}; font-size: 12px; font-weight: 500; }
    .perf-value { fill: ${theme.text}; font-size: 13px; font-weight: 700; }
    .lang-name  { fill: ${theme.text}; font-size: 12px; font-weight: 600; }
    .lang-pct   { fill: ${theme.muted}; font-size: 11px; font-weight: 700; }
    .tile-value { fill: ${theme.textBright}; font-size: 22px; font-weight: 800; letter-spacing: -0.8px; }
    .tile-sub   { fill: ${theme.muted}; font-size: 9px; font-weight: 500; letter-spacing: 0.2px; }
    .overview-name { fill: ${theme.accent}; font-size: 14px; font-weight: 800; letter-spacing: -0.3px; text-transform: uppercase; }
    .overview-sub  { fill: ${theme.muted}; font-size: 11px; font-weight: 400; }
    .panel-header  { fill: ${theme.textBright}; font-size: 13px; font-weight: 700; letter-spacing: -0.2px; }
  </style>
</svg>
  `.trim();
}

// ─── Badge Renderer ───────────────────────────────────────────────────────────
function renderBadge(label: string, theme: Theme, canvasWidth: number, id: string): string {
  const bw = Math.max(56, label.length * 7 + 20);
  const bx = canvasWidth - bw - 20;
  const bgId = `${id}_bdg`;
  return `
    <defs>
      <linearGradient id="${bgId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.accentSoft}" />
        <stop offset="100%" stop-color="${theme.accentGlow}" stop-opacity="1" />
      </linearGradient>
    </defs>
    <rect x="${bx}" y="22" width="${bw}" height="20" rx="10" fill="url(#${bgId})" stroke="${theme.accent}" stroke-width="0.8" opacity="0.85" />
    <text x="${bx + bw / 2}" y="36" text-anchor="middle" class="badge-text">${escapeXml(label.toUpperCase())}</text>
  `;
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function withAccent(theme: Theme, color?: string): Theme {
  if (!color) return theme;
  return { ...theme, accent: color };
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
