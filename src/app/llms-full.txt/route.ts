import { llmsFullTxt } from "@/lib/llms";
import { getContent } from "@/cms/content";

/** Plain-markdown summary for AI tools, generated from the CMS content. */
export async function GET() {
  return new Response(llmsFullTxt(await getContent()), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
