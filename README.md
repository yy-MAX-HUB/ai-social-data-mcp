<div align="center">

# AI Social Data MCP

### 让 Agent 不只“搜到网页”，而是真正进入社交平台的数据层

Built for **Cursor · Claude · Codex**  
搜索、自动翻页、读取详情、分析作者与评论区——全部通过 MCP 完成。

[![npm](https://img.shields.io/npm/v/ai-social-data-mcp?style=flat-square&logo=npm)](https://www.npmjs.com/package/ai-social-data-mcp)
[![MIT License](https://img.shields.io/badge/license-MIT-2ea44f?style=flat-square)](./LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Streamable_HTTP-6f42c1?style=flat-square)](https://www.aisocialdata.xyz/mcp)
[![Black-box](https://img.shields.io/badge/black--box-10%2F10_passed-1f883d?style=flat-square)](https://www.aisocialdata.xyz)

[一键安装到 Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=ai-social-data&config=eyJ1cmwiOiJodHRwczovL3d3dy5haXNvY2lhbGRhdGEueHl6L21jcCJ9)
 · [在线服务](https://www.aisocialdata.xyz)
 · [npm](https://www.npmjs.com/package/ai-social-data-mcp)
 · [Release](https://github.com/yy-MAX-HUB/ai-social-data-mcp/releases/latest)

</div>

---

## 为什么需要它？

普通网页搜索通常只能给 Agent 一组链接和摘要。面对社交平台，真正有价值的信息往往藏在：

- 搜索结果的第 2、3、4 页
- 视频或笔记的完整互动数据
- 创作者主页和历史作品
- 评论区里的价格、预约、体验和真实需求
- 不同平台对同一话题的反馈差异

AI Social Data MCP 把这些能力包装成 Agent 能理解、能组合、能自动翻页的结构化工具。

> **示例任务：**  
> “搜索 12 个北京旅游视频，不够就继续翻页；筛选互动高的内容，再读取评论区，总结游客最关心的问题。”

Agent 会自动完成：

```text
关键词搜索 → 判断 has_more → 自动翻页 → 内容详情
          → 作者资料 → 历史作品 → 评论 / 二级评论 → 分析
```

## 与普通网页搜索的区别

| 能力 | 普通网页搜索 | AI Social Data MCP |
|---|---:|---:|
| 返回网页链接与摘要 | ✓ | ✓ |
| 返回结构化互动指标 | — | ✓ |
| 自动翻页满足用户数量 | — | ✓ |
| 获取作者资料与作品 | — | ✓ |
| 获取一级 / 二级评论 | — | ✓ |
| 跨平台统一数据结构 | — | ✓ |

## 快速安装

无需注册，无需用户 API Key。选择你的 Agent，复制对应配置即可。

| Agent / 客户端 | 推荐连接方式 |
|---|---|
| Cursor | 远程 MCP URL / 一键安装 |
| Claude Code | `claude mcp add` 远程 HTTP |
| Claude Desktop | npm stdio 桥接器 |
| Codex CLI / IDE / ChatGPT Desktop | `config.toml` 远程 URL |
| Gemini CLI | `gemini mcp add` 远程 HTTP |
| VS Code / GitHub Copilot | `.vscode/mcp.json` |
| Windsurf | Cascade 远程 MCP |
| Cline | Streamable HTTP |
| Roo Code、Cherry Studio 等 | 通用 npm stdio 配置 |

### Cursor

最快方式：[一键安装到 Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=ai-social-data&config=eyJ1cmwiOiJodHRwczovL3d3dy5haXNvY2lhbGRhdGEueHl6L21jcCJ9)

手动安装：保存到项目的 `.cursor/mcp.json`，然后重新加载 Cursor。

```json
{
  "mcpServers": {
    "ai-social-data": {
      "url": "https://www.aisocialdata.xyz/mcp"
    }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http --scope user ai-social-data https://www.aisocialdata.xyz/mcp
```

检查连接：

```bash
claude mcp list
```

### Claude Desktop

Claude Desktop 使用 stdio 桥接器。要求 Node.js 18 或更高版本。

配置文件：

- Windows：`%APPDATA%\Claude\claude_desktop_config.json`
- macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ai-social-data": {
      "command": "npx",
      "args": ["-y", "ai-social-data-mcp"]
    }
  }
}
```

保存后完全退出并重新打开 Claude Desktop。

### Codex CLI / Codex IDE / ChatGPT Desktop

Codex CLI、IDE 扩展和 ChatGPT Desktop 共用 Codex MCP 配置。添加到 `~/.codex/config.toml`；也可在受信任项目中使用 `.codex/config.toml`。

```toml
[mcp_servers.ai-social-data]
url = "https://www.aisocialdata.xyz/mcp"
```

重新启动客户端后运行 `/mcp` 检查工具。

### Gemini CLI

命令行安装：

```bash
gemini mcp add --transport http ai-social-data https://www.aisocialdata.xyz/mcp
```

或者添加到 `~/.gemini/settings.json`：

```json
{
  "mcpServers": {
    "ai-social-data": {
      "url": "https://www.aisocialdata.xyz/mcp",
      "type": "http"
    }
  }
}
```

### VS Code / GitHub Copilot Agent

保存为工作区的 `.vscode/mcp.json`：

```json
{
  "servers": {
    "ai-social-data": {
      "type": "http",
      "url": "https://www.aisocialdata.xyz/mcp"
    }
  }
}
```

打开 Copilot Chat 的 Agent 模式；也可以从命令面板运行 **MCP: Add Server**。

### Windsurf

在 **Settings → Tools → Add Server** 中选择远程 HTTP，填入：

```text
https://www.aisocialdata.xyz/mcp
```

使用 Raw Config 时：

```json
{
  "mcpServers": {
    "ai-social-data": {
      "serverUrl": "https://www.aisocialdata.xyz/mcp"
    }
  }
}
```

保存后在 Cascade MCP 面板点击 Refresh。

### Cline

在 Cline 的 **MCP Servers → Remote Servers** 中选择 **Streamable HTTP**，或使用：

```json
{
  "mcpServers": {
    "ai-social-data": {
      "type": "streamableHttp",
      "url": "https://www.aisocialdata.xyz/mcp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Roo Code / Cherry Studio / 其他 stdio 客户端

只要客户端支持标准 `command + args` MCP 配置，就可以使用：

```json
{
  "mcpServers": {
    "ai-social-data": {
      "command": "npx",
      "args": ["-y", "ai-social-data-mcp"]
    }
  }
}
```

## 安装后如何验证？

检查 npm 桥接器：

```bash
npx -y ai-social-data-mcp --version
```

然后向 Agent 提问：

> 使用 `get_hot_list` 获取抖音前 3 个热点，并告诉我每个热点的热度。

安装成功时，客户端应显示以下 6 个工具：

```text
get_hot_list · social_search · get_content_detail
get_user_profile · get_user_posts · get_comments
```

## 适合哪些真实场景？

### 内容与选题研究

> “搜索 20 个机器人相关视频，自动翻页并按互动量整理选题方向。”

### 评论区消费者洞察

> “采集这个视频 100 条评论和热门回复，归纳用户抱怨、购买意向和高频问题。”

### 创作者尽调

> “找到人工智能领域创作者，读取公开资料和最近作品，筛选适合合作的账号。”

### 跨平台对比

> “对比抖音、小红书、Bilibili 和微博对同一旅游话题的内容角度与用户反馈。”

## 已验证平台

所有公开能力都经过真实端点黑盒测试；未通过验收的能力不会放进 schema。

| 平台 | 已验证能力 |
|---|---|
| 抖音 | 热点、内容/用户搜索、自动翻页、详情、用户资料、作品、一级/二级评论 |
| 小红书 | 真实分享链接笔记详情、作者、互动量、标签、媒体 |
| Bilibili | 真实 BVID 详情、作者、互动指标、评论 |
| 微博 | 真实帖子详情、作者、互动指标 |

## MCP 工具

<details>
<summary><code>get_hot_list</code> — 当前热点榜</summary>

适合热点晨报、选题发现和趋势追踪。
</details>

<details>
<summary><code>social_search</code> — 内容与用户搜索</summary>

返回 `pagination.has_more`、`next_cursor` 和翻页指令。Agent 会根据用户要求的总量继续调用，而不是停在第一页。
</details>

<details>
<summary><code>get_content_detail</code> — 内容详情</summary>

返回正文、作者、发布时间、互动指标和媒体信息；支持 `standard` 与 `full` 两种详细度。
</details>

<details>
<summary><code>get_user_profile</code> / <code>get_user_posts</code> — 创作者研究</summary>

获取公开资料和作品列表；作品支持自动翻页。
</details>

<details>
<summary><code>get_comments</code> — 评论与回复</summary>

支持一级评论、二级评论和 cursor 翻页。抖音单页最多 30 条。
</details>

## 验证情况

发布前执行了 10 个隔离的真实业务黑盒场景，每个场景都启动一个全新的 stdio MCP 客户端：

- 10 / 10 场景通过
- 搜索 4 页得到 12 个去重视频
- 评论自动翻 2 页得到 60 条去重评论
- 创作者作品自动翻 2 页得到 10 条作品
- 验证抖音评论树、小红书笔记、Bilibili 视频与评论、微博帖子
- Node.js 18 / 20 真实安装验证通过

## 工作方式与隐私

```text
Agent
  ├─ Remote MCP
  └─ npm stdio bridge
          ↓ HTTPS
  Free Hosted MCP
          ↓
  Public social-platform data
```

- 开源包只负责 MCP 协议桥接，不包含私有采集后端或服务器凭据。
- 桥接器不会读取本地文件。
- 查询参数会发送到托管服务以完成取数，请勿提交账号密码、Cookie 或私密数据。
- 免费服务采用公平使用限速；平台风控或上游变化可能导致个别能力暂时不可用。

## 开发

```bash
npm install
npm test          # 离线验证 tools/list 与 tools/call
npm run test:journey
```

自定义兼容端点：

```bash
AISOCIALDATA_MCP_URL=http://127.0.0.1:9100/mcp npx ai-social-data-mcp
```

非本机地址必须使用 HTTPS。

## License

开源桥接器使用 [MIT License](./LICENSE)。托管数据服务及其后端不属于本许可证授权范围。
