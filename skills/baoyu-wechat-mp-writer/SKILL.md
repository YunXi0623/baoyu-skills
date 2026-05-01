---
name: baoyu-wechat-mp-writer
description: WeChat Official Account full-workflow writing assistant. Supports topic discovery, article writing, polishing via baoyu-humanize, illustration suggestions, and one-click publishing to drafts. Use when user asks to "写公众号文章", "润色文章", "去AI味", "write wechat article", or needs WeChat content creation.
---

# 微信公众号写作助手

全流程辅助微信公众号文章创作，从选题到发布一站式解决。

## 核心功能

### 1. 热点选题建议
- 根据领域/关键词搜索最新热点
- 提供选题角度和切入点建议

### 2. 爆款标题生成（需用户确认）
**必选步骤**：确定选题后、写大纲之前，先输出候选标题供用户选择。

标题生成规则详见 [references/viral-title-rules.md](references/viral-title-rules.md)

核心要求：
- 每篇文章输出 **5 个候选标题**，标注所用手法类型
- 公式：**爆款标题 = 直击人性 + 吸睛词汇 + 顺口句式**
- 手法：提问、金钱、数字、异���、悬念、损失心理、反常识、矛盾冲突、抱大腿、代入感、人性弱点
- 标题字数不超过 50 字
- 推荐一个最终标题并说明理由
- 技术类文章也要有情绪张力，纯干货标题没人点

**交互要求**：
1. 输出 5 个候选标题（表格形式，含手法标注）
2. 给出推荐标题及理由
3. **等待用户确认**选择哪个标题（或用户自行修改）
4. 用户确认后才进入下一步

### 3. 文章大纲（需用户确认）
**必选步骤**：标题确认后、正式撰写之前，先输出大纲供用户审核。

大纲要求：
- 基于用户确认的标题，输出文章大纲框架
- 包含：各段落小标题 + 每段核心观点（1-2句话概述）
- 标注文章风格（技术干货/故事叙事/观点评论/教程指南）
- 预估全文字数

**交互要求**：
1. 输出完整大纲
2. **等待用户确认**（用户可调整段落顺序、增删内容、修改角度）
3. 用户确认后才开始正式撰写

### 4. 文章撰写
- 严格按照用户确认的标题和大纲撰写
- 支持多种风��：技术干货、故事叙事、观点评论、教程指南
- 自动适配公众号格式（标题、段落、重点标注）
- 生成引人入胜的开头和有行动号召的结尾

### 5. AI 去味润色（调用 `baoyu-humanize`）
**必选步骤**：正文完成后，不在当前 skill 内部直接执行去 AI 味改写，必须调用 `baoyu-humanize` 完成润色。

执行要求：
1. 读取 `../baoyu-humanize/SKILL.md`，按该 skill 的正式流程执行。
2. 默认参数使用：
   - `target_platform: wechat`
   - `preserve_structure: true`
   - `intensity: medium`
3. 如果用户明确要求“轻一点 / 重一点 / 更保留原文结构 / 更强化个人口吻”，按用户要求覆盖默认参数。
4. 输入为当前文章正文或 Markdown 文件，必须保留 YAML frontmatter、标题层级、代码块和核心事实。
5. 输出以 `baoyu-humanize` 的结果为准，后续审核、配图、发布全部基于润色后的版本继续。

详细改写规则不要在本 skill 内重复定义，统一以 `baoyu-humanize` 为准：
- [ai-patterns.md](../baoyu-humanize/references/ai-patterns.md) — AI 味特征清单和改写策略
- [platform-tone.md](../baoyu-humanize/references/platform-tone.md) — 微信公众号自然语感参考

### 5.5 内容合规审核（baoyu-content-review）
**必选步骤**：润色完成后、配图之前，必须执行违禁词审核。

1. 加载合规规则：
   - [common-rules.md](../baoyu-content-review/references/common-rules.md) — 广告法绝对化用语、虚假夸大、医疗/金融类
   - [wechat.md](../baoyu-content-review/references/platforms/wechat.md) — 微信公众号特有规则（诱导分享、标题党、外链限制）
2. 逐段扫描文章内容
3. 违规项自动修复（替换为建议用词）
4. 输出简要报告："合规审核完成，修复 N 处问题" 或 "合规审核通过 ✓"
5. 覆盖保存修复后的文章

### 6. 文章配图
- 调用 `baoyu-article-illustrator` 分析文章结构，自动在合适位置生成文中插图
  - 支持多种图片类型：信息图、场景图、流程图、对比图、框架图、时间线
  - 支持多种视觉风格：扁平、手绘、水彩、极简等
- 调用 `baoyu-cover-image` 根据文章内容生成封面图
  - 支持 5 个维度自定义：类型/配色/渲染风格/文字/情绪
  - 支持多种比例：16:9（默认）、2.35:1、1:1 等
- 图片生成执行优先级：
  1. 如果当前 Agent/宿主环境支持直接生成图片，优先直接输出图片；不要因为需要目标路径就先跑 CLI/API 后端
  2. 只有当宿主不支持直接生图、用户明确要求 API/provider、本地文件自动落地或批量脚本化生成时，才调用 `baoyu-image-gen`（Google/OpenAI/DashScope/Replicate）
  3. 默认不要调用 `baoyu-danger-gemini-web` 或 Gemini Web 反向生图；只有用户明确要求“用 Gemini Web”时才使用

### 7. 发布到公众号
- 生成符合微信格式的 Markdown
- 调用 baoyu-post-to-wechat 发布到草稿箱（支持 API 或浏览器方式）
- 自动通过 baoyu-markdown-to-html 转换为微信兼容 HTML
- 支持设置标题、作者、摘要

## 使用流程

```
用户输入需求
    ↓
选择功能模式：
  - 从零开始写 → 选题 → 生成标题(5个) → ⏸用户确认标题 → 大纲 → ⏸用户确认大纲 → 撰写 → 调用 baoyu-humanize → 审核 → 配图 → 发布
  - 已有草稿 → 生成标题(5个) → ⏸用户确认标题 → 调用 baoyu-humanize → 审核 → 配图 → 发布
  - 仅润色 → 调用 baoyu-humanize → 审核
  - 仅发布 → 调用发布工具
    ↓
⏸ 生成5个候选标题 → 等待用户确认
    ↓
⏸ 生成大纲 → 等待用户确认
    ↓
撰写全文（按确认的标题+大纲）
    ↓
调用 `baoyu-humanize` 去 AI 味润色（`target_platform=wechat`, `preserve_structure=true`）
    ↓
合规审核（baoyu-content-review）— 扫描违禁词，自动修复
    ↓
（可选）生成文中插图（baoyu-article-illustrator）
    ↓
（可选）生成封面图（baoyu-cover-image）
    ↓
（可选）转为微信格式（baoyu-markdown-to-html）
    ↓
（可选）发布到公众号草稿箱（baoyu-post-to-wechat）
```

## 写作风格指南

### 技术干货风格
- 开门见山，先给结论
- 步骤清晰，代码/命令可复制
- 加入踩坑记录和解决方案
- 结尾总结核心要点

### 故事叙事风格
- 场景化开头（时间、地点、人物）
- 情节推进有起伏
- 金句点睛
- 引发共鸣的结尾

### 观点评论风格
- 明确立场，不模棱两可
- 论据充分，数据支撑
- 承认反方观点并回应
- 给出行动建议

## `baoyu-humanize` 验收清单

调用 `baoyu-humanize` 后，检查文章是否还有 AI 痕迹：

- [ ] 没有"首先/其次/最后/综上所述"等模板化连接词
- [ ] 没有过于完美的三段式结构
- [ ] 有具体的个人经历或观察
- [ ] 有情感词（惊喜、崩溃、感动、无语）
- [ ] 有口语化表达（"说白了..."、"你可能想不到..."）
- [ ] 长短句交错，不是每段都一样长
- [ ] 有适当的括号补充（（笑）、（别问我怎么知道的））

## 配图规则

### 文中插图（baoyu-article-illustrator）

文章通过 `baoyu-humanize` 和合规审核后，调用 `baoyu-article-illustrator`：
1. 自动分析文章结构，识别需要配图的位置
2. 根据内容类型推荐图片类型和视觉风格
3. 生成详细提示词，优先由当前 Agent/宿主直接生成图片；仅在直接生图不可用或用户明确要求 API/provider 时调用 `baoyu-image-gen`
4. 将图片插入到文章的对应位置

| 文章类型 | 推荐图片类型 | 推荐风格 |
|---------|-------------|---------|
| 技术教程 | infographic, flowchart | minimal, blueprint |
| 产品测评 | comparison, scene | digital, editorial |
| 行业观点 | infographic, framework | elegant, minimal |
| 个人故事 | scene, timeline | warm, hand-drawn |
| 工具推荐 | comparison, infographic | flat-vector, minimal |

### 封面图（baoyu-cover-image）

文章完成后，调用 `baoyu-cover-image`：
1. 根据文章主题自动选择类型/配色/渲染风格/文字/情绪 5 个维度
2. 生成封面图（默认 16:9 比例）
3. 封面图用于微信公众号文章发布时的 `thumb_media_id`

### 图片生成后端

图片生成优先使用当前 Agent/宿主环境的直接图片输出能力，直接生成封面图和文中插图。不要因为工作流里存在目标路径就直接改用 CLI/API 后端。只有在需要显式选择 API provider、批量脚本化生成、本地文件自动落地，或宿主不支持直接输出图片时，才调用 `baoyu-image-gen`，支持：
- Google Gemini（默认）
- OpenAI GPT Image
- DashScope 通义万象
- Replicate

API Key 配置在 `~/.baoyu-skills/.env`。

禁止默认调用 `baoyu-danger-gemini-web` 进行图片生成；该技能只作为用户明确指定 Gemini Web 反向接口时的例外选项。

## 发布格式

生成的 Markdown 需符合 baoyu-post-to-wechat 要求：
- 使用标准 Markdown 语法
- 图片使用 `![描述](URL)` 格式
- 代码块指定语言类型
- 标题层级使用 ## 和 ###

## 工具调用

发布时调用 `baoyu-post-to-wechat` skill：
1. 先通过 `baoyu-markdown-to-html` 将 Markdown 转为微信兼容 HTML（支持主题选择）
2. 再通过 `baoyu-post-to-wechat` 发布到草稿箱（推荐 API 方式）

完整发布链路：写作输出 Markdown → baoyu-markdown-to-html 转 HTML → baoyu-post-to-wechat 发布草稿箱
