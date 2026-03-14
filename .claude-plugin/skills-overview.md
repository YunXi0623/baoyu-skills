# Skills 技能总览

所有技能定义于 `marketplace.json`，共 18 个，分三类。

## 内容技能 `content-skills`

| 技能 | 功能 |
|------|------|
| `baoyu-xhs-images` | 将内容拆解为 1-10 张小红书风格信息图，支持 10 种视觉风格 × 8 种布局 |
| `baoyu-post-to-x` | 自动发布内容/文章到 X（Twitter），支持图片/视频/长文 |
| `baoyu-post-to-wechat` | 发布文章到微信公众号，支持 HTML/Markdown/纯文本输入 |
| `baoyu-article-illustrator` | 分析文章结构，智能识别插图位置并生成配图 |
| `baoyu-cover-image` | 生成文章封面图，支持电影横幅(2.35:1)、宽屏(16:9)、正方形(1:1) |
| `baoyu-slide-deck` | 将内容生成专业演示文稿（PPT/幻灯片）图片 |
| `baoyu-comic` | 生成知识漫画，支持多种画风（Logicomix/Ohmsha 等风格） |
| `baoyu-infographic` | 生成专业信息图，21 种布局 × 20 种视觉风格 |
| `baoyu-x-copywriter` | 生成踏实自然的 X 推文，朋友聊天风格，无 AI 味，支持日常折腾/工具实测/踩坑复盘/里程碑/思考碎片五种模式 |
| `baoyu-trend-scout` | 搜索指定领域最新热点，结合 WebSearch 与网页抓取，推荐 3 个高潜力选题方向（含钩子标题、热点原因、内容大纲），适配 X/Twitter 和微信公众号 |
| `baoyu-article-writer` | 将选题方向/大纲扩写为公众号长文（1500-3000字），支持读取 baoyu-trend-scout 报告选题，朋友口吻有温度，无 AI 味 |

## AI 生成后端 `ai-generation-skills`

| 技能 | 功能 |
|------|------|
| `baoyu-danger-gemini-web` | 调用 Gemini Web API 生成文本和图像（反向工程，需 Chrome 登录） |
| `baoyu-image-gen` | 多平台 AI 图像生成，支持 OpenAI、Google、DashScope、Replicate |

## 工具技能 `utility-skills`

| 技能 | 功能 |
|------|------|
| `baoyu-danger-x-to-markdown` | 将 X/Twitter 推文/文章转换为 Markdown（需用户授权） |
| `baoyu-compress-image` | 图片压缩，默认转 WebP 格式，自动选择最优工具 |
| `baoyu-url-to-markdown` | 通过 Chrome CDP 抓取网页并转为 Markdown |
| `baoyu-format-markdown` | 格式化文章/Markdown，添加标题、摘要、加粗、列表等排版 |
| `baoyu-markdown-to-html` | Markdown 转样式化 HTML，支持微信公众号主题、代码高亮、数学公式 |
| `baoyu-send-email` | 发送邮件，支持 Resend API 和 SMTP（Gmail/QQ/163等），Markdown 自动转 HTML，可直接发送 trend-scout 报告或任意 .md 文件 |
