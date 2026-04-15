export type GitHubLanguage = {
  readonly name: string;
  readonly color: string | null;
  readonly size: number;
};

export type GitHubRepository = {
  readonly name: string;
  readonly isFork: boolean;
  readonly stargazerCount: number;
  readonly forkCount: number;
  readonly pushedAt: string | null;
  readonly languages: readonly GitHubLanguage[];
};

export type GitHubProfile = {
  readonly username: string;
  readonly name: string | null;
  readonly source: "graphql" | "private" | "public";
  readonly followers: number;
  readonly following: number;
  readonly publicRepoCount: number;
  readonly totalContributions: number;
  readonly commitContributions: number;
  readonly issueContributions: number;
  readonly pullRequestContributions: number;
  readonly reviewContributions: number;
  readonly repositories: readonly GitHubRepository[];
};

type GraphQlLanguageEdge = {
  readonly size: number;
  readonly node: {
    readonly name: string;
    readonly color: string | null;
  };
};

type GraphQlRepositoryNode = {
  readonly name: string;
  readonly isFork: boolean;
  readonly stargazerCount: number;
  readonly forkCount: number;
  readonly pushedAt: string | null;
  readonly languages: {
    readonly edges: readonly GraphQlLanguageEdge[] | null;
  } | null;
};

type GitHubGraphQlResponse = {
  readonly data?: {
    readonly user: {
      readonly login: string;
      readonly name: string | null;
      readonly followers: { readonly totalCount: number };
      readonly following: { readonly totalCount: number };
      readonly repositories: {
        readonly totalCount: number;
        readonly nodes: readonly GraphQlRepositoryNode[] | null;
      };
      readonly contributionsCollection: {
        readonly contributionCalendar: { readonly totalContributions: number };
        readonly totalCommitContributions: number;
        readonly totalIssueContributions: number;
        readonly totalPullRequestContributions: number;
        readonly totalPullRequestReviewContributions: number;
      };
    } | null;
  };
  readonly errors?: readonly { readonly message: string }[];
};

type RestUserResponse = {
  readonly login: string;
  readonly name: string | null;
  readonly followers: number;
  readonly following: number;
  readonly public_repos: number;
};

type RestRepositoryResponse = {
  readonly name: string;
  readonly fork: boolean;
  readonly stargazers_count: number;
  readonly forks_count: number;
  readonly pushed_at: string | null;
  readonly languages_url: string;
};

type RestLanguageResponse = Record<string, number>;

const profileQuery = `
  query GithubStatsProfile($login: String!) {
    user(login: $login) {
      login
      name
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          isFork
          stargazerCount
          forkCount
          pushedAt
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
      }
    }
  }
`;

export class GitHubApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export async function fetchGitHubProfile(
  username: string,
  source: "auto" | "private" | "public" = "auto",
): Promise<GitHubProfile> {
  const token = process.env.GITHUB_TOKEN;

  if (source === "public") {
    return fetchPublicGitHubProfile(username);
  }

  if (!token) {
    if (source === "private") {
      throw new GitHubApiError("GITHUB_TOKEN is required for private source");
    }

    return fetchPublicGitHubProfile(username);
  }

  if (source === "auto") {
    try {
      return await fetchGraphQlGitHubProfile(username, token, "graphql");
    } catch (error) {
      if (error instanceof GitHubApiError && error.message.includes("not found")) {
        throw error;
      }

      return fetchPublicGitHubProfile(username);
    }
  }

  return fetchGraphQlGitHubProfile(username, token, "private");
}

async function fetchGraphQlGitHubProfile(
  username: string,
  token: string,
  source: "graphql" | "private",
): Promise<GitHubProfile> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "user-agent": "github-stats-readme-cards",
    },
    body: JSON.stringify({
      query: profileQuery,
      variables: { login: username },
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new GitHubApiError(`GitHub API returned ${response.status}`);
  }

  const payload = (await response.json()) as GitHubGraphQlResponse;

  if (payload.errors && payload.errors.length > 0) {
    throw new GitHubApiError(payload.errors[0]?.message ?? "GitHub API error");
  }

  const user = payload.data?.user;

  if (!user) {
    throw new GitHubApiError("GitHub user was not found");
  }

  return {
    username: user.login,
    name: user.name,
    source,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    publicRepoCount: user.repositories.totalCount,
    totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
    commitContributions: user.contributionsCollection.totalCommitContributions,
    issueContributions: user.contributionsCollection.totalIssueContributions,
    pullRequestContributions: user.contributionsCollection.totalPullRequestContributions,
    reviewContributions: user.contributionsCollection.totalPullRequestReviewContributions,
    repositories: (user.repositories.nodes ?? []).map((repository) => ({
      name: repository.name,
      isFork: repository.isFork,
      stargazerCount: repository.stargazerCount,
      forkCount: repository.forkCount,
      pushedAt: repository.pushedAt,
      languages: (repository.languages?.edges ?? []).map((edge) => ({
        name: edge.node.name,
        color: edge.node.color,
        size: edge.size,
      })),
    })),
  };
}

async function fetchPublicGitHubProfile(username: string): Promise<GitHubProfile> {
  const [user, repositories] = await Promise.all([
    fetchRest<RestUserResponse>(`https://api.github.com/users/${encodeURIComponent(username)}`),
    fetchRest<readonly RestRepositoryResponse[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner&sort=updated`,
    ),
  ]);

  const ownedRepositories = repositories.filter((repository) => !repository.fork);
  const languageEntries = await Promise.all(
    ownedRepositories.slice(0, 30).map(async (repository) => ({
      repository,
      languages: await fetchRest<RestLanguageResponse>(repository.languages_url),
    })),
  );

  return {
    username: user.login,
    name: user.name,
    source: "public",
    followers: user.followers,
    following: user.following,
    publicRepoCount: user.public_repos,
    totalContributions: 0,
    commitContributions: 0,
    issueContributions: 0,
    pullRequestContributions: 0,
    reviewContributions: 0,
    repositories: languageEntries.map(({ repository, languages }) => ({
      name: repository.name,
      isFork: repository.fork,
      stargazerCount: repository.stargazers_count,
      forkCount: repository.forks_count,
      pushedAt: repository.pushed_at,
      languages: Object.entries(languages).map(([name, size]) => ({
        name,
        color: null,
        size,
      })),
    })),
  };
}

async function fetchRest<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "github-stats-readme-cards",
      "x-github-api-version": "2022-11-28",
    },
    signal: AbortSignal.timeout(8_000),
  });

  if (response.status === 404) {
    throw new GitHubApiError("GitHub user was not found");
  }

  if (!response.ok) {
    throw new GitHubApiError(`GitHub public API returned ${response.status}`);
  }

  return (await response.json()) as T;
}
