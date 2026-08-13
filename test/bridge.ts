import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { webcrypto } from "node:crypto";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { z } from "zod";

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

const upstream = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/mcp") {
    response.writeHead(404).end();
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));

  const server = new McpServer({ name: "mock-social-data", version: "1.0.0" });
  server.tool(
    "echo",
    "Returns the supplied text.",
    { text: z.string() },
    async ({ text }) => ({
      content: [{ type: "text", text }],
    })
  );
  const httpTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  response.on("close", () => {
    void httpTransport.close();
    void server.close();
  });
  await server.connect(httpTransport);
  await httpTransport.handleRequest(request, response, body);
});

await new Promise<void>((resolveListen) => {
  upstream.listen(0, "127.0.0.1", resolveListen);
});
const address = upstream.address();
assert.ok(address && typeof address === "object");

const here = dirname(fileURLToPath(import.meta.url));
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve(here, "../dist/index.js")],
  env: {
    ...process.env,
    FEEDSONAR_MCP_URL: `http://127.0.0.1:${address.port}/mcp`,
  } as Record<string, string>,
  stderr: "pipe",
});
const client = new Client({ name: "bridge-test", version: "1.0.0" });
let bridgeStderr = "";
transport.stderr?.on("data", (chunk) => {
  bridgeStderr += chunk.toString();
});

try {
  try {
    await client.connect(transport);
    const response = await client.listTools();
    assert.deepEqual(response.tools.map((tool) => tool.name), ["echo"]);
    const result = await client.callTool({
      name: "echo",
      arguments: { text: "bridge-ok" },
    });
    assert.equal(result.isError, undefined);
    assert.equal(result.content[0]?.type, "text");
    assert.equal(result.content[0]?.type === "text" && result.content[0].text, "bridge-ok");
    process.stdout.write("bridge ok: tools/list and tools/call\n");
  } catch (error) {
    throw new Error(`${String(error)}\nbridge stderr:\n${bridgeStderr}`);
  }
} finally {
  await client.close();
  await new Promise<void>((resolveClose, rejectClose) => {
    upstream.close((error) => (error ? rejectClose(error) : resolveClose()));
  });
}
