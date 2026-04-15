import type { GitHubProfile } from "../src/lib/github";

export const profileFixture: GitHubProfile = {
  username: "octocat",
  name: "The Octocat",
  source: "graphql",
  followers: 120,
  following: 5,
  publicRepoCount: 3,
  privateRepoCount: 2,
  totalContributions: 240,
  publicContributions: 210,
  privateContributions: 30,
  commitContributions: 200,
  issueContributions: 10,
  pullRequestContributions: 20,
  reviewContributions: 10,
  repositoryContributions: 12,
  repositories: [
    {
      name: "app",
      isFork: false,
      stargazerCount: 100,
      forkCount: 10,
      pushedAt: new Date().toISOString(),
      languages: [
        { name: "TypeScript", color: "#3178c6", size: 900 },
        { name: "JavaScript", color: "#f1e05a", size: 100 },
      ],
    },
    {
      name: "api",
      isFork: false,
      stargazerCount: 50,
      forkCount: 5,
      pushedAt: new Date().toISOString(),
      languages: [{ name: "Go", color: "#00add8", size: 500 }],
    },
    {
      name: "forked",
      isFork: true,
      stargazerCount: 1,
      forkCount: 1,
      pushedAt: new Date().toISOString(),
      languages: [{ name: "Ruby", color: "#701516", size: 2000 }],
    },
  ],
};
