// Generates illustrated team avatars (DiceBear "notionists") into /public/team.
// Runs automatically before `npm run build` (prebuild). TODO: replace with real photos.
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { mkdirSync, writeFileSync } from "node:fs";

const slugs = ["marcus-reynolds", "sophia-bennett", "ethan-carter", "amelia-hayes", "olivia-morgan"];
mkdirSync("public/team", { recursive: true });
for (const seed of slugs) {
  const svg = createAvatar(notionists, { seed, backgroundColor: ["transparent"] }).toString();
  writeFileSync(`public/team/${seed}.svg`, svg);
}
console.log(`Generated ${slugs.length} avatars in public/team/`);
