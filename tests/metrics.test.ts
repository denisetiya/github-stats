import { describe, expect, it } from "vitest";

import { summarizeLanguages, summarizePerformance, summarizeStats } from "../src/lib/metrics";
import { profileFixture } from "./fixtures";

describe("metrics", () => {
  it("summarizes repository stats", () => {
    const stats = summarizeStats(profileFixture);

    expect(stats).toMatchObject({
      totalStars: 151,
      totalForks: 16,
      publicRepos: 3,
      privateRepos: 2,
      contributions: 240,
      publicContributions: 210,
      privateContributions: 30,
    });
  });

  it("aggregates top languages and ignores fork language bytes", () => {
    const languages = summarizeLanguages(profileFixture);

    expect(languages.map((language) => language.name)).toEqual(["TypeScript", "Go", "JavaScript"]);
    expect(languages.some((language) => language.name === "Ruby")).toBe(false);
  });

  it("calculates deterministic performance summary", () => {
    const performance = summarizePerformance(profileFixture);

    expect(performance.score).toBeGreaterThan(0);
    expect(performance.activeRepos).toBe(3);
    expect(performance.collaborationEvents).toBe(40);
  });
});
