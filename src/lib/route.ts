import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";

import { fetchGitHubProfile, GitHubApiError, type GitHubProfile } from "./github";
import { summarizeLanguages, summarizePerformance, summarizeStats } from "./metrics";
import { parseCardQuery, type CardQuery } from "./query";
import {
  renderAllCard,
  renderErrorCard,
  renderLanguagesCard,
  renderPerformanceCard,
  renderStatsCard,
  type RenderOptions,
} from "./svg";

export type CardKind = "all" | "stats" | "languages" | "performance";

const cacheControl = "public, s-maxage=3600, stale-while-revalidate=86400";

export async function renderCardResponse(request: NextRequest, kind: CardKind): Promise<NextResponse> {
  let query: CardQuery | undefined;

  try {
    query = parseCardQuery(request.nextUrl.searchParams);
    const profile = await fetchGitHubProfile(query.username, query.source);
    const svg = renderCard(kind, profile, query);
    return svgResponse(svg, 200);
  } catch (error) {
    const status = statusFromError(error);
    const message = messageFromError(error, status);
    return svgResponse(renderErrorCard(message, status, query), status);
  }
}

function renderCard(kind: CardKind, profile: GitHubProfile, options: RenderOptions): string {
  switch (kind) {
    case "all":
      return renderAllCard(profile, summarizeStats(profile), summarizeLanguages(profile), summarizePerformance(profile), options);
    case "stats":
      return renderStatsCard(profile, summarizeStats(profile), options);
    case "languages":
      return renderLanguagesCard(profile, summarizeLanguages(profile), options);
    case "performance":
      return renderPerformanceCard(profile, summarizePerformance(profile), options);
  }
}

function svgResponse(svg: string, status: number): NextResponse {
  return new NextResponse(svg, {
    status,
    headers: {
      "cache-control": cacheControl,
      "content-type": "image/svg+xml; charset=utf-8",
    },
  });
}

function statusFromError(error: unknown): number {
  if (error instanceof ZodError) {
    return 400;
  }

  if (error instanceof GitHubApiError && error.message.includes("not found")) {
    return 404;
  }

  return 500;
}

function messageFromError(error: unknown, status: number): string {
  if (error instanceof ZodError) {
    return "Invalid request parameters";
  }

  if (error instanceof GitHubApiError && status === 404) {
    return "GitHub user was not found";
  }

  if (error instanceof GitHubApiError && error.message.includes("GITHUB_TOKEN")) {
    return "GitHub token is not configured";
  }

  return "Unable to load GitHub stats";
}
