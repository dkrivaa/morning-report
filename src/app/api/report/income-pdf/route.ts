import { apiStream, ApiException } from "@/lib/api";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const valid = token ? await verifyToken(token) : null;
  if (!valid) return new Response("Unauthorized", { status: 401 });

  const date = req.nextUrl.searchParams.get("date") ?? "";

  try {
    const upstream = await apiStream(
      `/api/report/income-pdf${date ? `?date=${date}` : ""}`
    );
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=income.pdf",
      },
    });
  } catch (e) {
    if (e instanceof ApiException) {
      return Response.json({ detail: e.detail }, { status: e.status });
    }
    return Response.json(
      { detail: { message: e instanceof Error ? e.message : "Unexpected error" } },
      { status: 502 }
    );
  }
}