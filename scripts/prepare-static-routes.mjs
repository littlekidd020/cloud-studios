#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contact, pageMeta, routes, siteUrl, structuredDataForPath } from "../src/site.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");
const index = path.join(client, "index.html");

if (!existsSync(index)) throw new Error("Missing static build entry: " + index);

const source = readFileSync(index, "utf8");

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta ${attribute}="${key}" content="[^"]*"\\s*/?>`);
  return html.replace(pattern, `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`);
}

function renderRoute(pathname) {
  const meta = pageMeta[pathname];
  const canonical = `${siteUrl}${pathname}`;
  let html = source
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<script id="local-business-data" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="local-business-data" type="application/ld+json">${JSON.stringify(structuredDataForPath(pathname))}</script>`);

  html = replaceMeta(html, "name", "description", meta.description);
  html = replaceMeta(html, "name", "application-name", contact.brand);
  html = replaceMeta(html, "property", "og:site_name", contact.brand);
  html = replaceMeta(html, "property", "og:title", meta.title);
  html = replaceMeta(html, "property", "og:description", meta.description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "name", "twitter:title", meta.title);
  html = replaceMeta(html, "name", "twitter:description", meta.description);
  return html;
}

for (const [route] of routes) {
  const directory = route === "/" ? client : path.join(client, route.slice(1));
  mkdirSync(directory, { recursive: true });
  writeFileSync(path.join(directory, "index.html"), renderRoute(route));
}

console.log(`Prepared metadata for ${routes.length} static route entries in dist/client`);
