import { llmsFullTxt } from "@/lib/llms";

/** /llms-full.txt: plain-markdown summary for AI tools, generated from the site content. */
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
