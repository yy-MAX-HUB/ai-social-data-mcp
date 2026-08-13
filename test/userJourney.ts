import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve(here, "../dist/index.js")],
  env: {
    ...process.env,
    AISOCIALDATA_MCP_URL:
      process.env.AISOCIALDATA_TEST_URL || "https://www.aisocialdata.xyz/mcp",
  } as Record<string, string>,
  stderr: "pipe",
});
const client = new Client({ name: "cursor-user-journey", version: "1.0.0" });

async function call(name: string, args: Record<string, unknown>) {
  const response = await client.callTool({ name, arguments: args });
  assert.notEqual(response.isError, true, `${name} returned an MCP error`);
  const text = response.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n");
  return JSON.parse(text);
}

try {
  await client.connect(transport);

  const tools = await client.listTools();
  assert.ok(tools.tools.some((tool) => tool.name === "social_search"));

  const hot = await call("get_hot_list", { platform: "douyin", limit: 5 });
  assert.ok(hot.items.length > 0, "hot list is empty");

  const search = await call("social_search", {
    platform: "douyin",
    query: "人工智能",
    type: "content",
    count: 3,
  });
  assert.ok(search.items.length > 0, "search returned no content");

  const candidate = search.items.find(
    (item: { id?: string; author?: { sec_uid?: string } }) =>
      item.id && item.author?.sec_uid
  );
  assert.ok(candidate, "search returned no usable content ID and author ID");

  const detail = await call("get_content_detail", {
    platform: "douyin",
    content_id: candidate.id,
  });
  assert.equal(detail.item.id, candidate.id);
  assert.ok(detail.item.description || detail.item.title);

  const profile = await call("get_user_profile", {
    platform: "douyin",
    sec_user_id: candidate.author.sec_uid,
  });
  assert.ok(profile.profile.id || profile.profile.nickname);

  const posts = await call("get_user_posts", {
    platform: "douyin",
    sec_user_id: candidate.author.sec_uid,
    count: 2,
  });
  assert.ok(posts.items.length > 0);
  assert.ok(posts.items.length <= 2);

  const comments = await call("get_comments", {
    platform: "douyin",
    content_id: candidate.id,
    count: 2,
  });
  assert.ok(Array.isArray(comments.items));
  assert.ok(comments.items.length <= 2);

  process.stdout.write(
    JSON.stringify(
      {
        tools: tools.tools.length,
        hotItems: hot.items.length,
        searchedItems: search.items.length,
        contentId: detail.item.id,
        profile: profile.profile.nickname || profile.profile.id,
        posts: posts.items.length,
        comments: comments.items.length,
      },
      null,
      2
    ) + "\n"
  );
} finally {
  await client.close();
}
