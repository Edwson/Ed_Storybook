/**
 * Story-domain tool: get_story (single story args + description).
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { GetStoryInput } from "../schemas.js";
import { findStory } from "../services/stories.js";
import { err, formatEnvelope } from "../services/format.js";

export function registerStoryTools(server: McpServer): void {
  server.registerTool(
    "eds_get_story",
    {
      title: "Get a Storybook story's args + description",
      description: `Return the parsed args, argTypes, and description text for a single story exported from a component's .stories.js file.

Useful for:
  - Discovering canonical example values for component props
  - Reading the per-story 'docs.description.story' prose
  - Generating a similar component from an existing story shape

Args:
  - component (string): fully-qualified key ('financial/regime-chip') or slug ('regime-chip')
  - story (string, optional): story export name (e.g., 'Primary'). If omitted, returns the first story exported.
  - response_format: 'markdown' (default) or 'json'

Returns (JSON shape):
  {
    "component": string,         // resolved component key
    "story": {
      "exportName": string,      // e.g. "Primary"
      "displayName": string,     // Storybook 'name' if set, else exportName
      "args": object | null,     // parsed best-effort from source
      "description": string?     // story-level docs description if set
    },
    "available_stories": string[]   // every story export the component has
  }

Examples:
  - 'Show me the Primary story for Button' → component='button', story='Primary'
  - 'What are the args for the regime chip's Bear story?' → component='regime-chip', story='AllRegimes'
  - 'First story for the disclosure banner' → component='disclosure-banner'`,
      inputSchema: GetStoryInput.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      const result = await findStory(params.component, params.story);
      if (!result) {
        return err(
          `Story not found for component '${params.component}'${params.story ? ` (story '${params.story}')` : ""}. ` +
            `Use eds_get_component to see the 'stories' array.`,
        );
      }
      const { component, story } = result;
      // Re-extract the full list so the agent can see what else exists.
      const { extractStories } = await import("../services/stories.js");
      const all = await extractStories(component);

      const payload = {
        component: component.key,
        story: {
          exportName: story.exportName,
          displayName: story.displayName,
          args: story.args,
          description: story.description,
        },
        available_stories: all.map((s) => s.exportName),
      };
      return formatEnvelope(params.response_format, payload, (p) => {
        const lines = [
          `# ${component.name} · ${(p.story as { displayName: string }).displayName}`,
          "",
          `Component: \`${p.component}\``,
          `Export: \`${(p.story as { exportName: string }).exportName}\``,
        ];
        const desc = (p.story as { description?: string }).description;
        if (desc) lines.push("", desc);
        const args = (p.story as { args: unknown }).args;
        if (args) {
          lines.push("", "## Args", "```json", JSON.stringify(args, null, 2), "```");
        }
        const stories = p.available_stories as string[];
        lines.push("", `## Available stories (${stories.length})`, stories.map((s) => `- ${s}`).join("\n"));
        return lines.join("\n");
      });
    },
  );
}
