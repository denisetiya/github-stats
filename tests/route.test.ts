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

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("image/svg+xml");
    expect(await response.text()).toContain("Invalid request parameters");
  });
});
