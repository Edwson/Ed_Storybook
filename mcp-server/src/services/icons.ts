/**
 * Icon scanner.
 *
 * Parses the `ICONS` object literal from
 * `src/foundations/icons/icons.js` without eval'ing it. We grab the
 * block between `export const ICONS = {` and the matching `};`, then
 * regex-walk the entries.
 */

import { readFile } from "node:fs/promises";

import { ICONS_SOURCE } from "../constants.js";
import type { IconMeta } from "../types.js";

let _cache: Map<string, IconMeta> | null = null;

export function _resetIconCache(): void {
  _cache = null;
}

export async function scanIcons(): Promise<Map<string, IconMeta>> {
  if (_cache) return _cache;
  const out = new Map<string, IconMeta>();

  let src: string;
  try {
    src = await readFile(ICONS_SOURCE, "utf8");
  } catch {
    _cache = out;
    return out;
  }

  // Lock onto the ICONS object literal and capture its body.
  const start = src.indexOf("export const ICONS");
  if (start === -1) {
    _cache = out;
    return out;
  }
  const braceStart = src.indexOf("{", start);
  if (braceStart === -1) {
    _cache = out;
    return out;
  }

  // Walk to the matching closing brace.
  let depth = 0;
  let braceEnd = -1;
  for (let i = braceStart; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        braceEnd = i;
        break;
      }
    }
  }
  if (braceEnd === -1) {
    _cache = out;
    return out;
  }

  const body = src.slice(braceStart + 1, braceEnd);

  // Parse `'name': '<path …/>',` entries — quotes can be ' or ".
  const re = /['"]([a-z0-9-]+)['"]\s*:\s*['"]([\s\S]*?)['"]\s*,/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    out.set(m[1], { name: m[1], paths: m[2] });
  }

  _cache = out;
  return out;
}

export async function findIcon(name: string): Promise<IconMeta | undefined> {
  const map = await scanIcons();
  return map.get(name);
}

/**
 * Render an icon as a complete `<svg>` string at the given size + stroke.
 */
export async function renderIconSvg(
  name: string,
  size = 24,
  stroke = 2,
): Promise<string | undefined> {
  const icon = await findIcon(name);
  if (!icon) return undefined;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" ` +
    `fill="none" stroke="currentColor" stroke-width="${stroke}" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
    icon.paths +
    `</svg>`
  );
}
