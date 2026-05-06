/**
 * Story extractor.
 *
 * Pulls each `export const Foo = { args: …, parameters: … }` block out
 * of a Storybook CSF 3 `.stories.js` file. We use regex + balanced-brace
 * matching rather than a JS parser — the stories follow a strict in-house
 * style (CSF 3 with literal-only args), so this is robust enough for
 * read-only metadata extraction.
 */

import { readFile } from "node:fs/promises";

import { findComponent } from "./components.js";
import type { ComponentMeta, StoryMeta } from "../types.js";

/**
 * Extract every story from a component's `.stories.js`.
 * Returns an empty array if the component has no stories file.
 */
export async function extractStories(
  component: ComponentMeta,
): Promise<StoryMeta[]> {
  if (!component.paths.stories) return [];
  let src: string;
  try {
    src = await readFile(component.paths.stories, "utf8");
  } catch {
    return [];
  }

  const out: StoryMeta[] = [];
  // Match: export const Name = { … };  or  export const Name = ({ … }) => …
  const re = /export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*({[\s\S]*?})\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const exportName = m[1];
    const body = m[2];
    const args = parseArgsLiteral(body);
    const displayName = matchProp(body, "name") ?? exportName;
    const description = matchStoryDescription(body);
    out.push({
      componentKey: component.key,
      exportName,
      displayName: stripQuotes(displayName) || exportName,
      args,
      description: description ? stripQuotes(description) : undefined,
    });
  }
  return out;
}

/**
 * Find a single story by component identifier + export name.
 */
export async function findStory(
  componentId: string,
  storyName?: string,
): Promise<{ component: ComponentMeta; story: StoryMeta } | null> {
  const component = await findComponent(componentId);
  if (!component) return null;
  const stories = await extractStories(component);
  if (stories.length === 0) return null;
  const story = storyName
    ? stories.find(
        (s) =>
          s.exportName.toLowerCase() === storyName.toLowerCase() ||
          s.displayName.toLowerCase() === storyName.toLowerCase(),
      )
    : stories[0];
  return story ? { component, story } : null;
}

// ─────────────────────────────────────────────────────────────────────

/** Best-effort `args: { … }` literal parser. Returns null on failure. */
function parseArgsLiteral(body: string): Record<string, unknown> | null {
  const argsBlock = matchObjectProp(body, "args");
  if (!argsBlock) return null;
  return parseObjectLiteral(argsBlock);
}

/**
 * Locate `{key}: { … }` inside a story export body and return the inner
 * `{ … }` substring.
 */
function matchObjectProp(src: string, key: string): string | null {
  const re = new RegExp(`\\b${key}\\s*:\\s*\\{`, "g");
  const m = re.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length - 1; // position of the opening `{`
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return null;
}

/** `name: 'Foo'` → `'Foo'` (raw, including quotes). */
function matchProp(src: string, key: string): string | null {
  const re = new RegExp(`\\b${key}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*?)\\1`);
  const m = re.exec(src);
  return m ? `${m[1]}${m[2]}${m[1]}` : null;
}

/** parameters.docs.description.story extractor (story-level prose). */
function matchStoryDescription(src: string): string | null {
  // We just look for `story: '…'` inside a parameters block.
  const params = matchObjectProp(src, "parameters");
  if (!params) return null;
  return matchProp(params, "story");
}

function stripQuotes(s: string): string {
  if (!s) return s;
  return s.replace(/^['"`]/, "").replace(/['"`]$/, "");
}

/**
 * Tiny JSON-ish object-literal parser. Handles:
 *   { a: 1, b: "two", c: true, d: null, e: [1,2], f: { g: 3 } }
 * Keys may be unquoted identifiers. Strings may use ' " or `.
 * Trailing commas allowed. Comments stripped.
 *
 * Returns null on any unrecognised construct (functions, regex, …).
 */
function parseObjectLiteral(src: string): Record<string, unknown> | null {
  try {
    const cleaned = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
    const tokens = tokenize(cleaned);
    const result = parseValue(tokens, { i: 0 });
    return typeof result === "object" && result !== null && !Array.isArray(result)
      ? (result as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

type Token =
  | { kind: "punct"; value: string }
  | { kind: "string"; value: string }
  | { kind: "number"; value: number }
  | { kind: "bool"; value: boolean }
  | { kind: "null" }
  | { kind: "ident"; value: string };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if ("{}[]:,".includes(ch)) {
      out.push({ kind: "punct", value: ch });
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      let str = "";
      while (j < src.length) {
        if (src[j] === "\\" && j + 1 < src.length) {
          str += src[j + 1];
          j += 2;
        } else if (src[j] === ch) {
          break;
        } else {
          str += src[j];
          j++;
        }
      }
      out.push({ kind: "string", value: str });
      i = j + 1;
      continue;
    }
    if (/[-0-9]/.test(ch)) {
      let j = i;
      while (j < src.length && /[-+0-9.eE]/.test(src[j])) j++;
      const num = Number(src.slice(i, j));
      if (Number.isFinite(num)) out.push({ kind: "number", value: num });
      else throw new Error("bad number");
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_$]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (word === "true") out.push({ kind: "bool", value: true });
      else if (word === "false") out.push({ kind: "bool", value: false });
      else if (word === "null" || word === "undefined") out.push({ kind: "null" });
      else out.push({ kind: "ident", value: word });
      i = j;
      continue;
    }
    throw new Error(`unexpected char '${ch}' at ${i}`);
  }
  return out;
}

function parseValue(tokens: Token[], cursor: { i: number }): unknown {
  const t = tokens[cursor.i++];
  if (!t) throw new Error("unexpected end");
  if (t.kind === "string") return t.value;
  if (t.kind === "number") return t.value;
  if (t.kind === "bool") return t.value;
  if (t.kind === "null") return null;
  if (t.kind === "ident") return t.value; // bare identifier — preserve verbatim
  if (t.kind === "punct" && t.value === "{") {
    const obj: Record<string, unknown> = {};
    if (tokens[cursor.i]?.kind === "punct" && (tokens[cursor.i] as { value: string }).value === "}") {
      cursor.i++;
      return obj;
    }
    while (cursor.i < tokens.length) {
      const key = tokens[cursor.i++];
      if (key.kind !== "string" && key.kind !== "ident") throw new Error("bad key");
      const colon = tokens[cursor.i++];
      if (!(colon.kind === "punct" && colon.value === ":")) throw new Error("expected :");
      obj[key.kind === "string" ? key.value : key.value] = parseValue(tokens, cursor);
      const next = tokens[cursor.i];
      if (next?.kind === "punct" && next.value === ",") {
        cursor.i++;
        if (tokens[cursor.i]?.kind === "punct" && (tokens[cursor.i] as { value: string }).value === "}") {
          cursor.i++;
          return obj;
        }
        continue;
      }
      if (next?.kind === "punct" && next.value === "}") {
        cursor.i++;
        return obj;
      }
      throw new Error("expected , or }");
    }
    throw new Error("unterminated object");
  }
  if (t.kind === "punct" && t.value === "[") {
    const arr: unknown[] = [];
    if (tokens[cursor.i]?.kind === "punct" && (tokens[cursor.i] as { value: string }).value === "]") {
      cursor.i++;
      return arr;
    }
    while (cursor.i < tokens.length) {
      arr.push(parseValue(tokens, cursor));
      const next = tokens[cursor.i];
      if (next?.kind === "punct" && next.value === ",") {
        cursor.i++;
        if (tokens[cursor.i]?.kind === "punct" && (tokens[cursor.i] as { value: string }).value === "]") {
          cursor.i++;
          return arr;
        }
        continue;
      }
      if (next?.kind === "punct" && next.value === "]") {
        cursor.i++;
        return arr;
      }
      throw new Error("expected , or ]");
    }
    throw new Error("unterminated array");
  }
  throw new Error(`unexpected token ${JSON.stringify(t)}`);
}
