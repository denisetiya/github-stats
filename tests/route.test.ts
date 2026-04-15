import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderCardResponse } from "../src/lib/route";

describe("renderCardResponse", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns svg for valid stats requests", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            user: {
              login: "octocat",
              name: "The Octocat",
              followers: { totalCount: 1 },
              following: { totalCount: 2 },
              publicRepositories: { totalCount: 1 },
              privateRepositories: { totalCount: 2 },
              repositories: {
                totalCount: 1,
                nodes: [
                  {
                    name: "app",
                    isFork: false,
                    stargazerCount: 3,
                    forkCount: 4,
                    pushedAt: new Date().toISOString(),
                    languages: {
                      edges: [
                        {
                          size: 100,
                          node: { name: "TypeScript", color: "#3178c6" },
                        },
                      ],
                    },
                  },
                ],
              },
              contributionsCollection: {
                contributionCalendar: { totalContributions: 5 },
                totalCommitContributions: 5,
                totalIssueContributions: 0,
                totalPullRequestContributions: 0,
                totalPullRequestReviewContributions: 0,
                totalRepositoryContributions: 1,
                restrictedContributionsCount: 2,
              },
            },
          },
        }),
        { status: 200 },
      ),
    );

    const response = await renderCardResponse(
      new NextRequest("https://example.test/api/stats?username=octocat"),
      "stats",
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(await response.text()).toContain("octocat&#39;s GitHub Stats");
  });

  it("returns an svg error card for invalid query params", async () => {
    const response = await renderCardResponse(new NextRequest("https://example.test/api/stats"), "stats");

    expect(response.status).toBe(200);
    expect(response.headers.get("x-github-stats-error-status")).toBe("400");
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(await response.text()).toContain("Invalid request parameters");
  });

  it("returns a renderable svg error card when private mode has no token", async () => {
    const response = await renderCardResponse(
      new NextRequest("https://example.test/api/all?username=octocat&source=private&theme=dark"),
      "all",
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-github-stats-error-status")).toBe("500");
    expect(await response.text()).toContain("GitHub token is required for this source");
  });

  it("uses no-store cache headers when refresh is present", async () => {
    const response = await renderCardResponse(
      new NextRequest("https://example.test/api/all?username=octocat&source=private&theme=dark&refresh=1"),
      "all",
    );

    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("x-github-stats-cache-key")).toBe("1");
  });

  it("uses public REST mode without a GitHub token", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : input instanceof URL ? input.toString() : input;

      if (url.includes("/users/octocat/repos")) {
        return Promise.resolve(new Response(
          JSON.stringify([
            {
              name: "hello-world",
              fork: false,
              stargazers_count: 10,
              forks_count: 2,
              pushed_at: new Date().toISOString(),
              languages_url: "https://api.github.com/repos/octocat/hello-world/languages",
            },
          ]),
          { status: 200 },
        ));
      }

      if (url.includes("/languages")) {
        return Promise.resolve(new Response(JSON.stringify({ JavaScript: 1000 }), { status: 200 }));
      }

      return Promise.resolve(new Response(
        JSON.stringify({
          login: "octocat",
          name: "The Octocat",
          followers: 12,
          following: 3,
          public_repos: 1,
        }),
        { status: 200 },
      ));
    });

    const response = await renderCardResponse(
      new NextRequest("https://example.test/api/stats?username=octocat&source=public"),
      "stats",
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalled();
    expect(await response.text()).toContain("public data");
  });

  it("renders all-in-one public overview card", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = input instanceof Request ? input.url : input instanceof URL ? input.toString() : input;

      if (url.includes("/users/octocat/repos")) {
        return Promise.resolve(
          new Response(
            JSON.stringify([
              {
                name: "hello-world",
                fork: false,
                stargazers_count: 10,
                forks_count: 2,
                pushed_at: new Date().toISOString(),
                languages_url: "https://api.github.com/repos/octocat/hello-world/languages",
              },
            ]),
            { status: 200 },
          ),
        );
      }

      if (url.includes("/languages")) {
        return Promise.resolve(new Response(JSON.stringify({ TypeScript: 900, JavaScript: 100 }), { status: 200 }));
      }

      return Promise.resolve(
        new Response(
          JSON.stringify({
            login: "octocat",
            name: "The Octocat",
            followers: 12,
            following: 3,
            public_repos: 1,
          }),
          { status: 200 },
        ),
      );
    });

    const response = await renderCardResponse(
      new NextRequest("https://example.test/api/all?username=octocat&source=public"),
      "all",
    );
    const svg = await response.text();

    expect(response.status).toBe(200);
    expect(svg).toContain("octocat&#39;s GitHub Overview");
    expect(svg).toContain("public overview");
  });
});
