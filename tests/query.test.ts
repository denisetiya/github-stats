import { describe, expect, it } from "vitest";

import { parseCardQuery } from "../src/lib/query";

describe("parseCardQuery", () => {
  it("parses required username and default style params", () => {
    const query = parseCardQuery(new URLSearchParams("username=octocat"));

    expect(query).toEqual({
      username: "octocat",
      theme: "github",
      hide_border: false,
      color: undefined,
      title: undefined,
    });
  });

  it("normalizes hex colors", () => {
    const query = parseCardQuery(new URLSearchParams("username=octocat&color=0969da"));

    expect(query.color).toBe("#0969da");
  });

  it("rejects missing usernames", () => {
    expect(() => parseCardQuery(new URLSearchParams())).toThrow();
  });

  it("rejects unsafe usernames", () => {
    expect(() => parseCardQuery(new URLSearchParams("username=-octocat"))).toThrow();
  });
});
