import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const files = [
  "Dockerfile",
  "scripts/e2e/Dockerfile",
  "scripts/e2e/Dockerfile.qr-import",
  "scripts/docker/cleanup-smoke/Dockerfile",
  "scripts/docker/install-sh-e2e/Dockerfile",
  "scripts/docker/install-sh-smoke/Dockerfile",
  ".github/workflows/ci.yml",
  ".github/workflows/formal-conformance.yml",
];

it.each(files)("%s pins Node at or above the SG-027 baseline", (file) => {
  const source = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const versions = [...source.matchAll(/(?:FROM node:|node-version:\s*["']?)([\d.x]+)/g)].map(
    (match) => match[1],
  );
  expect(versions.length).toBeGreaterThan(0);
  for (const version of versions) {
    expect(version).toMatch(/^22\.\d+\.\d+$/);
    const [, minor, patch] = version.split(".").map(Number);
    expect(minor > 23 || (minor === 23 && patch >= 4), `${version} predates 22.23.4`).toBe(true);
  }
});
