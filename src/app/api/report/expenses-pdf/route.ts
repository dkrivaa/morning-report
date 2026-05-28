import { apiStream } from "@/lib/api";
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
      `/api/report/expenses-pdf${date ? `?date=${date}` : ""}`
    );
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=expenses.pdf",
        "X-Other-Expenses": upstream.headers.get("x-other_expenses") ?? "{}",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to generate expenses PDF";
    return Response.json({ detail: { message } }, { status: 502 });
  }
}