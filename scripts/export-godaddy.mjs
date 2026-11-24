// Builds a static site into out/ for GoDaddy File Manager (no SSH, no Node on the server).
// The build runs in a copy so API routes and /studio, which need Node, stay out of the export.
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const stage = join(root, "..", "vasay-static-stage");

const skip = new Set(["node_modules", ".next", ".git", ".export-hide", ".static-stage", "out"]);

function copySource() {
  if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
  mkdirSync(stage);
  cpSync(root, stage, {
    recursive: true,
    filter: (src) => {
      const rel = src.slice(root.length).replaceAll("\\", "/").replace(/^\//, "");
      if (!rel) return true;
      const top = rel.split("/")[0];
      if (skip.has(top)) return false;
      if (rel === "src/app/api" || rel.startsWith("src/app/api/")) return false;
      if (rel === "src/app/studio" || rel.startsWith("src/app/studio/")) return false;
      if (rel.endsWith(".zip")) return false;
      return true;
    },
  });
  // Reuse the installed packages. A junction avoids copying about a gigabyte.
  const link = spawn("cmd", ["/c", "mklink", "/J", join(stage, "node_modules"), join(root, "node_modules")], {
    stdio: "inherit",
  });
  return new Promise((resolve, reject) => {
    link.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`mklink exited ${code}`))));
  });
}

function prepareStage() {
  const files = readdirSync(join(stage, "src"), { recursive: true });
  for (const rel of files) {
    const file = join(stage, "src", String(rel));
    if (!statSync(file).isFile()) continue;
    if (file.endsWith("opengraph-image.tsx")) {
      rmSync(file);
      continue;
    }
    if (file.endsWith("PreviewTools.tsx")) {
      writeFileSync(file, "export default function PreviewTools() {\n  return null;\n}\n");
      continue;
    }
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
    const original = readFileSync(file, "utf8");
    let text = original;
    const isMetadataRoute = /(?:^|[\\/])(robots|sitemap|manifest)\.ts$/.test(file) || file.endsWith("route.ts");
    if (text.includes("generateStaticParams") && !text.includes("dynamicParams")) {
      text = text.replace(
        "export async function generateStaticParams",
        "export const dynamicParams = false;\n\nexport async function generateStaticParams",
      );
    }
    if (isMetadataRoute && !text.includes('dynamic = "force-static"')) {
      const imports = text.match(/^(?:import .*\r?\n)+/);
      const at = imports ? imports[0].length : 0;
      text = text.slice(0, at) + 'export const dynamic = "force-static";\n\n' + text.slice(at);
    }
    text = text
      .replace(/import \{ draftMode \} from "next\/headers";\r?\n/, "")
      .replace(
        /const preview = process\.env\.STATIC_EXPORT === "1" \? false : \(await draftMode\(\)\)\.isEnabled;/,
        "const preview = false;",
      )
      .replace(/const \{ isEnabled: preview \} = await draftMode\(\);/, "const preview = false;")
      .replace(/import \{ cacheLife, cacheTag \} from "next\/cache";\r?\n/, "")
      .replace(/^[ \t]*"use cache";\r?\n/gm, "")
      .replace(/^[ \t]*cacheLife\([^)]*\);\r?\n/gm, "")
      .replace(/^[ \t]*cacheTag\([^)]*\);\r?\n/gm, "")
      .replace(/\r?\nexport const instant = false;\r?\n/g, "\n");
    if (text !== original) writeFileSync(file, text);
  }
}

const childEnv = {
  ...process.env,
  STATIC_EXPORT: "1",
  // The project the CMS at /studio edits. Content was copied from the Vercel project.
  NEXT_PUBLIC_SANITY_PROJECT_ID: "wfxxs1zv",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  NEXT_PUBLIC_SITE_URL: "https://vasay.ai",
  NEXT_PUBLIC_FORM_ENDPOINT: "/contact.php",
  NEXT_PUBLIC_NOINDEX: "",
};

copySource()
  .then(() => prepareStage())
  .then(
    () =>
      new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [join(stage, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
          cwd: stage,
          stdio: "inherit",
          env: childEnv,
        });
        child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`next build exited ${code}`))));
      }),
  )
  .then(() => {
    const out = join(root, "out");
    if (existsSync(out)) rmSync(out, { recursive: true, force: true });
    cpSync(join(stage, "out"), out, { recursive: true });
    console.log(`Static site written to ${out}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
