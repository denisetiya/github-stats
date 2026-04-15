import { describe, expect, it } from "vitest";

import { summarizeStats } from "../src/lib/metrics";
import { renderStatsCard } from "../src/lib/svg";
import { profileFixture } from "./fixtures";

describe("svg renderer", () => {
  it("renders valid svg and escapes user-controlled text", () => {
    const svg = renderStatsCard(
      {
        ...profileFixture,
        username: "octocat<script>",
      },
      summarizeStats(profileFixture),
      {
        theme: "github",
        hide_border: false,
        title: "<Stats>",
        color: undefined,
      },
    );

    expect(svg).toContain("<svg");
    expect(svg).toContain("&lt;Stats&gt;");
    expect(svg).not.toContain("<script>");
  });
});
