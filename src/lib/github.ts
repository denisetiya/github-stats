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

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new GitHubApiError("GITHUB_TOKEN is not configured");
  }

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
