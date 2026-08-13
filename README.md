# AI Social Data MCP

让 Cursor、Codex、Claude 等 Agent 获取详细的社交平台公开数据。

本仓库是完全开源的 MCP stdio 桥接器。它连接免费的托管 MCP 服务；数据采集后端运行在项目方服务器，不包含在本仓库中。

- 托管服务：<https://www.aisocialdata.xyz>
- 源码：<https://github.com/yy-MAX-HUB/ai-social-data-mcp>

## 一键使用

无需 API Key。Cursor 用户可直接点击：

[一键安装 AI Social Data MCP](cursor://anysphere.cursor-deeplink/mcp/install?name=ai-social-data&config=eyJ1cmwiOiJodHRwczovL3d3dy5haXNvY2lhbGRhdGEueHl6L21jcCJ9)

或使用项目配置：

```json
{
  "mcpServers": {
    "ai-social-data": {
      "url": "https://www.aisocialdata.xyz/mcp"
    }
  }
}
```

支持 stdio 的客户端也可以通过 npm 桥接器连接（要求 Node.js 18 或更高版本）：

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

Codex CLI：

```toml
[mcp_servers.ai-social-data]
url = "https://www.aisocialdata.xyz/mcp"
```

支持远程 MCP 的客户端也可以直接连接：

```text
https://www.aisocialdata.xyz/mcp
```

## 当前工具

- `get_hot_list`：获取当前热点榜
- `social_search`：按关键词搜索公开内容
- `get_content_detail`：获取视频、笔记或帖子的详细数据
- `get_user_profile`：获取公开用户资料
- `get_user_posts`：获取用户发布列表
- `get_comments`：获取一级或二级评论

当前已在真实环境验证：

- 抖音：热点、内容/用户搜索、详情、用户资料、用户作品、一级/二级评论及自动翻页
- 小红书：真实分享链接笔记详情
- Bilibili：真实 BVID 详情与评论
- 微博：真实帖子详情

未通过黑盒验收的能力不会加入公共 schema。

## 工作方式

```text
Agent ──stdio──> 本桥接器 ──HTTPS MCP──> 免费托管服务 ──> 社交平台公开数据
```

桥接器不会读取本地文件，也不需要用户提供项目方 API Key。工具参数和查询内容会发送到托管服务以完成请求，请勿提交账号密码、Cookie 或其他私密数据。

免费服务采用公平使用限制，包括按来源限速和并发限制。平台风控或上游变化可能导致部分工具暂时不可用。

## 自定义服务地址

开发者可以连接兼容的自建端点：

```bash
AISOCIALDATA_MCP_URL=http://127.0.0.1:9100/mcp npx ai-social-data-mcp
```

非本机地址必须使用 HTTPS。

## 本地开发

```bash
npm install
npm test
npm run test:journey
```

## 许可证

桥接器使用 MIT License。托管数据服务及其后端不属于本许可证授权范围。
