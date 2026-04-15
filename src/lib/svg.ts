import type { GitHubProfile } from "./github";
import type { CardQuery } from "./query";
import type { LanguageSummary, PerformanceSummary, StatsSummary } from "./metrics";

type Theme = {
  readonly background: string;
  readonly border: string;
  readonly text: string;
  readonly muted: string;
  readonly accent: string;
  readonly track: string;
};

export type RenderOptions = Pick<CardQuery, "theme" | "title" | "hide_border" | "color">;

const themes: Record<CardQuery["theme"], Theme> = {
  github: {
    background: "#ffffff",
    border: "#d0d7de",
    text: "#24292f",
    muted: "#57606a",
    accent: "#0969da",
    track: "#eaeef2",
  },
  dark: {
    background: "#0d1117",
    border: "#30363d",
    text: "#f0f6fc",
    muted: "#8b949e",
    accent: "#2f81f7",
    track: "#21262d",
  },
  light: {
    background: "#f6f8fa",
    border: "#d8dee4",
    text: "#1f2328",
    muted: "#656d76",
    accent: "#1a7f37",
    track: "#d0d7de",
  },
  tokyonight: {
    background: "#1a1b27",
    border: "#3b4261",
    text: "#c0caf5",
    muted: "#9aa5ce",
    accent: "#7aa2f7",
    track: "#292e42",
  },
};

export function renderStatsCard(profile: GitHubProfile, stats: StatsSummary, options: RenderOptions): string {
  const rows = [
    ["Repositories", formatNumber(stats.publicRepos)],
    ["Stars", formatNumber(stats.totalStars)],
    ["Forks", formatNumber(stats.totalForks)],
    ["Contributions", formatNumber(stats.contributions)],
    ["Followers", formatNumber(stats.followers)],
    ["Following", formatNumber(stats.following)],
  ] as const;

  return renderBaseCard({
    height: 260,
    title: options.title ?? `${profile.username}'s GitHub Stats`,
    options,
    body: () =>
      rows
        .map(([label, value], index) => {
          const y = 72 + index * 28;
          return `
            <text x="24" y="${y}" class="muted">${escapeXml(label)}</text>
            <text x="396" y="${y}" text-anchor="end" class="value">${escapeXml(value)}</text>
          `;
        })
        .join(""),
    footer: () => `<text x="24" y="236" class="muted">Updated from public GitHub data</text>`,
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
    body: ({ theme }) => {
      const total = languages.reduce((sum, language) => sum + language.percentage, 0);
      let offset = 0;
      const bar = languages
        .map((language) => {
          const width = total > 0 ? Math.max(3, (language.percentage / total) * 372) : 0;
          const segment = `<rect x="${24 + offset}" y="63" width="${width}" height="10" fill="${escapeXml(language.color)}" />`;
          offset += width;
          return segment;
        })
        .join("");
      const rows = languages
        .map((language, index) => {
          const y = 105 + index * 25;
          return `
            <circle cx="30" cy="${y - 5}" r="5" fill="${escapeXml(language.color)}" />
            <text x="44" y="${y}" class="muted">${escapeXml(language.name)}</text>
            <text x="396" y="${y}" text-anchor="end" class="value">${language.percentage.toFixed(1)}%</text>
          `;
        })
        .join("");

      return `
        <rect x="24" y="63" width="372" height="10" rx="5" fill="${theme.track}" />
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
    ["Contributions", formatNumber(performance.contributionEvents)],
    ["Collaboration", formatNumber(performance.collaborationEvents)],
  ] as const;

  return renderBaseCard({
    height: 230,
    title: options.title ?? `${profile.username}'s Performance`,
    options,
    body: ({ theme }) => `
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
            <text x="155" y="${y}" class="muted">${escapeXml(label)}</text>
            <text x="396" y="${y}" text-anchor="end" class="value">${escapeXml(value)}</text>
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
        .value { fill: ${theme.text}; font: 600 14px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .score { fill: ${theme.text}; font: 700 28px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      </style>
      <rect width="420" height="${input.height}" rx="8" fill="${theme.background}" />
      ${border}
      <text x="24" y="38" class="title">${escapeXml(input.title)}</text>
      ${input.body({ theme })}
      ${input.footer?.({ theme }) ?? ""}
    </svg>
  `.trim();
}

function withAccent(theme: Theme, color?: string): Theme {
  return {
    ...theme,
    accent: color ?? theme.accent,
  };
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
