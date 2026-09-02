#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routes } from "../src/site.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");
const index = path.join(client, "index.html");

if (!existsSync(index)) throw new Error("Missing static build entry: " + index);

for (const [route] of routes) {
  if (route === "/") continue;
  const directory = path.join(client, route.slice(1));
  mkdirSync(directory, { recursive: true });
  copyFileSync(index, path.join(directory, "index.html"));
}

console.log(`Prepared ${routes.length - 1} static route entries in dist/client`);
