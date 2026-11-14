import { llmsTxt } from "@/lib/llms";

/** /llms.txt: plain-markdown summary for AI tools, generated from the site content. */
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
