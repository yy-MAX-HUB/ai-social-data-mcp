#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const packageVersion = "0.1.1";
const defaultEndpoint = "https://www.aisocialdata.xyz/mcp";

function printHelp(): void {
  process.stdout.write(
    [
      "AI Social Data MCP",
      "",
      "Starts a local stdio MCP bridge to the free hosted social-data service.",
      "",
      "Environment:",
      `  AISOCIALDATA_MCP_URL  Hosted MCP endpoint (default: ${defaultEndpoint})`,
      "",
    ].join("\n")
  );
}

function endpointUrl(): URL {
  const url = new URL(process.env.AISOCIALDATA_MCP_URL || defaultEndpoint);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
    throw new Error("AISOCIALDATA_MCP_URL 必须使用 HTTPS；仅 localhost 可使用 HTTP");
  }
  return url;
}

function toolError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    isError: true,
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({
          error: {
            code: "UPSTREAM_UNAVAILABLE",
            message: `社交数据服务暂时不可用：${message}`,
            retryable: true,
          },
        }),
      },
    ],
  };
}

async function main(): Promise<void> {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printHelp();
    return;
  }
  if (process.argv.includes("--version") || process.argv.includes("-v")) {
    process.stdout.write(`${packageVersion}\n`);
    return;
  }

  const endpoint = endpointUrl();
  const upstream = new Client(
    { name: "ai-social-data-stdio-bridge", version: packageVersion },
    { capabilities: {} }
  );
  const upstreamTransport = new StreamableHTTPClientTransport(endpoint, {
    requestInit: {
      headers: {
        "User-Agent": `ai-social-data-mcp/${packageVersion}`,
        "X-AI-Social-Data-Client": `stdio-bridge/${packageVersion}`,
      },
    },
    reconnectionOptions: {
      initialReconnectionDelay: 500,
      maxReconnectionDelay: 5_000,
      reconnectionDelayGrowFactor: 2,
      maxRetries: 3,
    },
  });

  await upstream.connect(upstreamTransport);

  const server = new Server(
    { name: "ai-social-data", version: packageVersion },
    {
      capabilities: { tools: {} },
      instructions:
        "Use these tools to retrieve detailed public social-platform data. Prefer search first, then fetch details, posts, or comments with returned IDs.",
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async (request) => {
    return await upstream.listTools(request.params);
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      return await upstream.callTool(request.params);
    } catch (error) {
      return toolError(error);
    }
  });

  const stdio = new StdioServerTransport();
  await server.connect(stdio);
  process.stderr.write(`[ai-social-data] connected to ${endpoint.origin}\n`);

  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    await Promise.allSettled([server.close(), upstream.close()]);
  };
  process.once("SIGINT", () => void close());
  process.once("SIGTERM", () => void close());
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[ai-social-data] startup failed: ${message}\n`);
  process.exitCode = 1;
});
