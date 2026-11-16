import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

/**
 * Called by the Studio's Presentation tool to turn on Draft Mode (validated by Sanity with the
 * read token, which stays on the server: no NEXT_PUBLIC_ prefix).
 */
const token = process.env.SANITY_API_READ_TOKEN;

export const { GET } = client && token
  ? defineEnableDraftMode({ client: client.withConfig({ token }) })
  : { GET: () => new Response("Preview is not configured (SANITY_API_READ_TOKEN missing).", { status: 404 }) };
