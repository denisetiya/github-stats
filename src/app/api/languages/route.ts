import type { NextRequest } from "next/server";

import { renderCardResponse } from "@/lib/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  return renderCardResponse(request, "languages");
}
