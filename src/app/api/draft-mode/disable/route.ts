import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

/** Leave preview: turn Draft Mode off and go back to the page. */
export async function GET(req: NextRequest) {
  (await draftMode()).disable();
  const to = req.nextUrl.searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(to.startsWith("/") ? to : "/", req.url));
}
