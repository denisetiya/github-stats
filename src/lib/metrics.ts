import type { GitHubLanguage, GitHubProfile } from "./github";

export type LanguageSummary = {
  readonly name: string;
  readonly color: string;
  readonly size: number;
  readonly percentage: number;
};

export type StatsSummary = {
  readonly totalStars: number;
  readonly totalForks: number;
  readonly publicRepos: number;
  readonly followers: number;
  readonly following: number;
  readonly contributions: number;
};

export type PerformanceSummary = {
  readonly score: number;
  readonly label: "Growing" | "Active" | "Consistent" | "High Impact";
  readonly activeRepos: number;
  readonly contributionEvents: number;
  readonly collaborationEvents: number;
};

const fallbackLanguageColor = "#6e7781";

export function summarizeStats(profile: GitHubProfile): StatsSummary {
  return {
    totalStars: profile.repositories.reduce((sum, repository) => sum + repository.stargazerCount, 0),
    totalForks: profile.repositories.reduce((sum, repository) => sum + repository.forkCount, 0),
    publicRepos: profile.publicRepoCount,
    followers: profile.followers,
    following: profile.following,
    contributions: profile.totalContributions,
  };
}

export function summarizeLanguages(profile: GitHubProfile, limit = 5): readonly LanguageSummary[] {
  const languages = new Map<string, GitHubLanguage>();

  for (const repository of profile.repositories) {
    if (repository.isFork) {
      continue;
    }

    for (const language of repository.languages) {
      const current = languages.get(language.name);
      languages.set(language.name, {
        name: language.name,
        color: current?.color ?? language.color ?? fallbackLanguageColor,
        size: (current?.size ?? 0) + language.size,
      });
    }
  }

  const totalSize = [...languages.values()].reduce((sum, language) => sum + language.size, 0);

  if (totalSize === 0) {
    return [];
  }

  return [...languages.values()]
    .sort((left, right) => right.size - left.size)
    .slice(0, limit)
    .map((language) => ({
      name: language.name,
      color: language.color ?? fallbackLanguageColor,
      size: language.size,
      percentage: Math.round((language.size / totalSize) * 1_000) / 10,
    }));
}

export function summarizePerformance(profile: GitHubProfile): PerformanceSummary {
  const activeSince = Date.now() - 1000 * 60 * 60 * 24 * 180;
  const activeRepos = profile.repositories.filter((repository) => {
    if (!repository.pushedAt) {
      return false;
    }

    return new Date(repository.pushedAt).getTime() >= activeSince;
  }).length;

  const collaborationEvents =
    profile.issueContributions + profile.pullRequestContributions + profile.reviewContributions;
  const contributionEvents = profile.totalContributions;
  const repoScore = Math.min(activeRepos * 4, 24);
  const contributionScore = Math.min(contributionEvents / 10, 40);
  const collaborationScore = Math.min(collaborationEvents * 1.5, 24);
  const impactScore = Math.min(profile.followers / 5 + summarizeStats(profile).totalStars / 10, 12);
  const score = Math.min(100, Math.round(repoScore + contributionScore + collaborationScore + impactScore));

  return {
    score,
    label: score >= 80 ? "High Impact" : score >= 60 ? "Consistent" : score >= 35 ? "Active" : "Growing",
    activeRepos,
    contributionEvents,
    collaborationEvents,
  };
}
