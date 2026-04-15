import type { GitHubProfile } from "./github";
import type { CardQuery } from "./query";
import type { LanguageSummary, PerformanceSummary, StatsSummary } from "./metrics";

type Theme = {
  readonly background: string;
  readonly surface: string;
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
    border: "#30363d",
    text: "#f0f6fc",
    muted: "#8b949e",
    accent: "#2f81f7",
    accentSoft: "#102a43",
    track: "#21262d",
  },
  light: {
    background: "#f6f8fa",
    surface: "#ffffff",
    border: "#d8dee4",
    text: "#1f2328",
    muted: "#656d76",
    accent: "#1a7f37",
    accentSoft: "#dafbe1",
    track: "#d0d7de",
  },
  tokyonight: {
    background: "#1a1b27",
    surface: "#222436",
    border: "#3b4261",
    text: "#c0caf5",
    muted: "#9aa5ce",
    accent: "#7aa2f7",
    accentSoft: "#292e42",
    track: "#292e42",
  },
};

export function renderStatsCard(profile: GitHubProfile, stats: StatsSummary, options: RenderOptions): string {
  const rows = [
    ["Repos", formatNumber(stats.publicRepos), "Public repositories"],
    ["Stars", formatNumber(stats.totalStars), "Total stars earned"],
    ["Forks", formatNumber(stats.totalForks), "Repository forks"],
    [
      profile.source === "public" ? "Source" : "Contribs",
      profile.source === "public" ? "Public" : formatNumber(stats.contributions),
      profile.source === "public" ? "No token required" : "Yearly contributions",
    ],
    ["Followers", formatNumber(stats.followers), "GitHub followers"],
    ["Following", formatNumber(stats.following), "Following"],
  ] as const;

  return renderBaseCard({
    height: 282,
    title: options.title ?? `${profile.username}'s GitHub Stats`,
    options,
    badge: profile.source === "public" ? "public data" : profile.source === "private" ? "private data" : "token data",
    body: ({ theme }) =>
      rows
        .map(([label, value, description], index) => {
          const column = index % 2;
          const row = Math.floor(index / 2);
          const x = 24 + column * 190;
          const y = 72 + row * 58;
          return `
            <rect x="${x}" y="${y}" width="176" height="46" rx="8" fill="${theme.surface}" stroke="${theme.border}" />
            <circle cx="${x + 17}" cy="${y + 17}" r="5" fill="${theme.accent}" />
            <text x="${x + 30}" y="${y + 19}" class="metric-label">${escapeXml(label)}</text>
            <text x="${x + 152}" y="${y + 19}" text-anchor="end" class="metric-value">${escapeXml(value)}</text>
            <text x="${x + 14}" y="${y + 36}" class="tiny">${escapeXml(description)}</text>
          `;
        })
        .join(""),
    footer: () =>
      `<text x="24" y="258" class="tiny">${profile.source === "public" ? "Uses public GitHub REST data without a token" : profile.source === "private" ? "Includes private repositories visible to the token" : "Uses authenticated GitHub GraphQL data"}</text>`,
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
    ["Fans", formatNumber(stats.followers)],
  ] as const;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (performance.score / 100) * circumference;

  return renderBaseCard({
    height: 430,
    title: options.title ?? `${profile.username}'s GitHub Overview`,
    options,
    badge: profile.source === "public" ? "public overview" : profile.source === "private" ? "private overview" : "full overview",
    body: ({ theme }) => {
      const statTiles = statItems
        .map(([label, value], index) => {
          const x = 24 + index * 96;
          return `
            <rect x="${x}" y="70" width="84" height="54" rx="8" fill="${theme.surface}" stroke="${theme.border}" />
            <text x="${x + 12}" y="92" class="metric-label">${escapeXml(label)}</text>
            <text x="${x + 12}" y="112" class="big-value">${escapeXml(value)}</text>
          `;
        })
        .join("");
      const languageBlock =
        languages.length > 0
          ? renderCompactLanguages(languages, theme, 24, 174, 372)
          : `<text x="24" y="188" class="muted">${escapeXml(profile.username)} has no language data yet.</text>`;

      return `
        ${statTiles}
        <text x="24" y="153" class="section-title">Top Languages</text>
        ${languageBlock}
        <text x="24" y="304" class="section-title">Performance</text>
        <rect x="24" y="322" width="372" height="72" rx="8" fill="${theme.surface}" stroke="${theme.border}" />
        <circle cx="72" cy="358" r="${radius}" fill="none" stroke="${theme.track}" stroke-width="8" />
        <circle
          cx="72"
          cy="358"
          r="${radius}"
          fill="none"
          stroke="${theme.accent}"
          stroke-width="8"
          stroke-linecap="round"
          stroke-dasharray="${circumference.toFixed(2)}"
          stroke-dashoffset="${dashOffset.toFixed(2)}"
          transform="rotate(-90 72 358)"
        />
        <text x="72" y="354" text-anchor="middle" class="small-score">${performance.score}</text>
        <text x="72" y="372" text-anchor="middle" class="tiny">score</text>
        <text x="132" y="348" class="metric-value">${escapeXml(performance.label)}</text>
        <text x="132" y="369" class="metric-label">Active repos: ${formatNumber(performance.activeRepos)}</text>
        <text x="132" y="387" class="metric-label">${profile.source === "public" ? "Public score from repositories, stars, forks, and followers" : profile.source === "private" ? "Includes repositories visible to the configured token" : "Activity score from GitHub contributions and collaboration"}</text>
      `;
    },
    footer: () =>
      `<text x="24" y="414" class="tiny">${profile.source === "public" ? "No token required. Uses public GitHub REST data." : profile.source === "private" ? "Private mode requires self-hosting with a GitHub token." : "Uses authenticated GitHub GraphQL data."}</text>`,
  });
}

export function renderLanguagesCard(
  profile: GitHubProfile,
  languages: readonly LanguageSummary[],
  options: RenderOptions,
): string {
  if (languages.length === 0) {
    return renderMessageCard(options, options.title ?? "Top Languages", `${profile.username} has no language data yet.`);
  }

  return renderBaseCard({
    height: 245,
    title: options.title ?? "Top Languages",
    options,
    badge: profile.source === "public" ? "public data" : profile.source === "private" ? "private data" : "token data",
    body: ({ theme }) => {
      const total = languages.reduce((sum, language) => sum + language.percentage, 0);
      let offset = 0;
      const bar = languages
        .map((language) => {
          const width = total > 0 ? Math.max(3, (language.percentage / total) * 372) : 0;
          const segment = `<rect x="${24 + offset}" y="66" width="${width}" height="12" rx="6" fill="${escapeXml(language.color)}" />`;
          offset += width;
          return segment;
        })
        .join("");
      const rows = languages
        .map((language, index) => {
          const y = 110 + index * 25;
          return `
            <circle cx="31" cy="${y - 5}" r="6" fill="${escapeXml(language.color)}" />
            <text x="47" y="${y}" class="metric-label">${escapeXml(language.name)}</text>
            <text x="396" y="${y}" text-anchor="end" class="metric-value">${language.percentage.toFixed(1)}%</text>
          `;
        })
        .join("");

      return `
        <rect x="24" y="66" width="372" height="12" rx="6" fill="${theme.track}" />
        ${bar}
        ${rows}
      `;
    },
  });
}

export function renderPerformanceCard(
  profile: GitHubProfile,
  performance: PerformanceSummary,
  options: RenderOptions,
): string {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (performance.score / 100) * circumference;
  const rows = [
    ["Status", performance.label],
    ["Active repos", formatNumber(performance.activeRepos)],
    [
      profile.source === "public" ? "Public signal" : "Contributions",
      profile.source === "public" ? "Repos" : formatNumber(performance.contributionEvents),
    ],
    ["Collaboration", formatNumber(performance.collaborationEvents)],
  ] as const;

  return renderBaseCard({
    height: 230,
    title: options.title ?? `${profile.username}'s Performance`,
    options,
    badge: profile.source === "public" ? "public score" : profile.source === "private" ? "private score" : "activity score",
    body: ({ theme }) => `
      <rect x="24" y="69" width="110" height="112" rx="8" fill="${theme.surface}" stroke="${theme.border}" />
      <circle cx="76" cy="125" r="${radius}" fill="none" stroke="${theme.track}" stroke-width="10" />
      <circle
        cx="76"
        cy="125"
        r="${radius}"
        fill="none"
        stroke="${theme.accent}"
        stroke-width="10"
        stroke-linecap="round"
        stroke-dasharray="${circumference.toFixed(2)}"
        stroke-dashoffset="${dashOffset.toFixed(2)}"
        transform="rotate(-90 76 125)"
      />
      <text x="76" y="119" text-anchor="middle" class="score">${performance.score}</text>
      <text x="76" y="141" text-anchor="middle" class="muted">score</text>
      ${rows
        .map(([label, value], index) => {
          const y = 90 + index * 28;
          return `
            <text x="155" y="${y}" class="metric-label">${escapeXml(label)}</text>
            <text x="396" y="${y}" text-anchor="end" class="metric-value">${escapeXml(value)}</text>
          `;
        })
        .join("")}
    `,
  });
}

export function renderErrorCard(message: string, status: number, options?: Partial<RenderOptions>): string {
  return renderMessageCard(
    {
      theme: options?.theme ?? "github",
      title: options?.title,
      hide_border: options?.hide_border ?? false,
      color: options?.color,
    },
    "GitHub Stats Error",
    `${status}: ${message}`,
  );
}

function renderMessageCard(options: RenderOptions, title: string, message: string): string {
  return renderBaseCard({
    height: 145,
    title,
    options,
    body: () => `<text x="24" y="86" class="muted">${escapeXml(message)}</text>`,
  });
}

function renderBaseCard(input: {
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
    : `<rect x="0.5" y="0.5" width="419" height="${input.height - 1}" rx="8" fill="none" stroke="${theme.border}" />`;

  return `
    <svg width="420" height="${input.height}" viewBox="0 0 420 ${input.height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(input.title)}">
      <style>
        .title { fill: ${theme.text}; font: 600 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .muted { fill: ${theme.muted}; font: 400 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .metric-label { fill: ${theme.muted}; font: 500 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .metric-value { fill: ${theme.text}; font: 700 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .tiny { fill: ${theme.muted}; font: 400 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .badge { fill: ${theme.accent}; font: 600 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .score { fill: ${theme.text}; font: 700 28px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .small-score { fill: ${theme.text}; font: 700 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .big-value { fill: ${theme.text}; font: 800 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .section-title { fill: ${theme.text}; font: 700 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      </style>
      <rect width="420" height="${input.height}" rx="8" fill="${theme.background}" />
      ${border}
      <rect x="0" y="0" width="420" height="4" fill="${theme.accent}" />
      <circle cx="368" cy="31" r="46" fill="${theme.accentSoft}" opacity="0.9" />
      <circle cx="391" cy="17" r="28" fill="${theme.accent}" opacity="0.12" />
      <text x="24" y="38" class="title">${escapeXml(input.title)}</text>
      ${input.badge ? renderBadge(input.badge, theme) : ""}
      ${input.body({ theme })}
      ${input.footer?.({ theme }) ?? ""}
    </svg>
  `.trim();
}

function renderCompactLanguages(
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
      const segment = `<rect x="${x + offset}" y="${y}" width="${segmentWidth}" height="12" rx="6" fill="${escapeXml(language.color)}" />`;
      offset += segmentWidth;
      return segment;
    })
    .join("");
  const rows = languages
    .slice(0, 4)
    .map((language, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const rowX = x + column * 190;
      const rowY = y + 42 + row * 28;

      return `
        <circle cx="${rowX + 7}" cy="${rowY - 5}" r="6" fill="${escapeXml(language.color)}" />
        <text x="${rowX + 21}" y="${rowY}" class="metric-label">${escapeXml(language.name)}</text>
        <text x="${rowX + 174}" y="${rowY}" text-anchor="end" class="metric-value">${language.percentage.toFixed(1)}%</text>
      `;
    })
    .join("");

  return `
    <rect x="${x}" y="${y}" width="${width}" height="12" rx="6" fill="${theme.track}" />
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

function renderBadge(label: string, theme: Theme): string {
  const width = Math.max(74, label.length * 7 + 22);
  const x = 396 - width;

  return `
    <rect x="${x}" y="24" width="${width}" height="22" rx="8" fill="${theme.accentSoft}" stroke="${theme.border}" />
    <text x="${x + width / 2}" y="39" text-anchor="middle" class="badge">${escapeXml(label)}</text>
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
