# Contributing

The public repository contains only the open-source MCP bridge. The hosted collection backend is maintained separately.

## Development

```bash
npm install
npm test
```

`npm test` is offline and verifies both `tools/list` and `tools/call` through the packaged stdio bridge.

To validate the live hosted service:

```bash
npm run test:journey
```

Keep changes focused on the bridge, installation experience, protocol compatibility, tests, or documentation. Do not add platform credentials, cookies, proxy URLs, private backend code, or captured user data.
