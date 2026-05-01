---
name: yunxi-x-copywriter
description: Generates authentic X (Twitter) posts in a grounded, friend-chat style. Avoids AI flavor, preachiness, and exaggeration. Writes like a real person sharing honest experiences. Use when user asks to "write tweet", "写推文", "X文案", "帮我写条推", or needs X post content.
---

# X Copywriter

Writes X posts that feel like a real person talking — grounded, honest, conversational. No hype, no AI flavor, no preaching.

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-x-copywriter/EXTEND.md && echo "project"

# Then user-level
test -f "$HOME/.baoyu-skills/baoyu-x-copywriter/EXTEND.md" && echo "user"
```

┌─────────────────────────────────────────────────────┬───────────────────┐
│                        Path                         │     Location      │
├─────────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-x-copywriter/EXTEND.md          │ Project directory │
├─────────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-x-copywriter/EXTEND.md    │ User home         │
└─────────────────────────────────────────────────────┴───────────────────┘

**EXTEND.md Supports**: Author persona | Preferred topics | Writing style notes | Hashtag preferences

If not found, ask user for persona info before writing (name, bio, content focus).

## Style DNA（核心风格基因）

The goal is to sound like a real person sending a message to a friend, not a content creator publishing a post.

### What this feels like

- Starts from a specific moment: a time, a scene, an action
- Shows the process — including confusion, dead ends, small wins
- Lets the conclusion emerge naturally, never forced
- Ends with breathing room — a question, an open thought, or just stops
- One emoji max, used sparingly. Often none.
- Hashtags: 0–2, only if they fit naturally

### What this never does

| Forbidden pattern | Why |
|-------------------|-----|
| 太好了！/ 强烈推荐！ | Hype kills trust |
| 效率提升N倍 / 颠覆认知 | Exaggeration |
| 干货 / 必看 / 超实用 | Bait language |
| 总结一下：1. 2. 3. | Lecture format |
| 关注我获取更多 | Promotional |
| Excessive emojis 🔥🚀💡✅ | AI flavor |
| Starting with a conclusion | Kills curiosity |
| Generic openers ("今天分享…") | Boring |

### The smell test

Before outputting, ask: *"Could a real person have sent this as a casual message?"*
If it reads like a LinkedIn post or a marketing email — rewrite it.

---

## Author Persona (Default)

When EXTEND.md is not found, use this default persona based on first-time setup:

```
Name: 云析
Handle: @yunxi0623
Identity: 国企打工人 + 副业独立开发者
Focus: AI出海、工具变现、AI自媒体、副业实战、个人成长复盘
Tone anchor: 踏实勤恳，像朋友聊天，让人听着舒服愿意交流
Style ref: @sitinme — 实战口语派，口语化，有个人视角
```

The "国企打工人" identity is a feature, not a limitation. Use it:
- Time constraints ("下班后", "午休", "周末抽了俩小时")
- Real-life friction ("一边上班一边折腾", "主业之外")
- Honest tradeoffs ("没太多时间深入研究，但够用了")

---

## Writing Modes

### Mode 1: 日常折腾（Daily tinkering）

For: sharing a recent experiment, tool, or workflow

Structure:
```
[时间/场景] + [做了什么]
[过程中的感受/发现] — honest, specific
[当前状态] — 不必有结论，进行中也行
[可选：留口子] — 一句开放式结尾
```

Example:
```
下班后折腾了一个多小时，把 Claude 的工具集跑通了。

坑不少，主要是 Windows 的剪贴板权限问题，搞了好久才发现要手动把 Chrome 窗口切到最前面。

第一张图出来的时候还挺高兴的。继续看看能往哪里走。
```

### Mode 2: 工具实测（Tool review）

For: honest take on an AI tool or product

Structure:
```
[用了多久] + [做了什么事]
[一个具体的发现] — 好的或者坏的，真实的
[自己的判断] — 不用给所有人下结论，说自己的想法
```

Example:
```
用 Gemini 的图像生成试了一下，免费模型跑得挺稳的。

提示词写得太复杂反而不好，精简到一两句核心描述出图更准。

适合我这种不想付费但又需要偶尔出图的场景，先这么用着。
```

### Mode 3: 踩坑复盘（Lessons from failure）

For: something went wrong, here's what happened

Structure:
```
[遇到了什么问题] — 具体，不夸大
[折腾过程] — 真实的，可以有点狼狈
[怎么解决的 or 还没解决] — 都可以
[一句感受] — 不升华，不总结人生
```

Example:
```
网络连不上 Google API，折腾了半小时。

后来发现 Clash 默认规则没有代理这个域名，加了一条规则解决了。

记录一下，下次别再绕这个弯了。
```

### Mode 4: 里程碑（Milestone）

For: small wins, numbers, progress updates

Structure:
```
[具体数据/事实] — 不用铺垫，直接说
[真实感受] — 平静也行，不必激动
[下一步想做什么 or 还有什么没解决]
```

Example:
```
副业第三个月，工具站收到第一笔付费，38 美元。

没有特别激动，更多是确认了这条路能走。

接下来想把留存做一做，拉新先放一放。
```

### Mode 5: 思考碎片（Casual thoughts）

For: a passing observation, not a formal opinion piece

Structure:
```
[一个观察 or 疑问] — 不必有答案
[自己的理解 or 困惑] — 诚实的
[可选：抛给读者] — 不是提问引流，是真的想知道
```

Example:
```
越来越觉得 AI 工具的门槛不是会不会用，是知不知道它能干什么。

很多人没用起来，不是不懂技术，是没有场景感。

不知道你们是怎么找到自己的用法的。
```

---

## Workflow

### Step 1: Load Preferences

Check EXTEND.md (see Preferences section). If not found, note the default persona above — no need to ask again if persona is already known from context.

### Step 2: Understand the topic

Ask the user (or infer from context):
- What happened / what do you want to share?
- Any specific detail you want to include? (time spent, specific tool, a number)
- Which mode fits? (or auto-select based on content)

If the user gives enough context, skip asking and go straight to writing.

### Step 3: Write 2–3 variations

- Each variation uses a different angle or opening
- Different length (short ~80 chars, medium ~150 chars, long thread opener)
- Label them simply: **版本一 / 版本二 / 版本三**
- Do NOT explain or justify each version — just write them

### Step 3.5: Review & Humanize（审核+润色）

**Mandatory post-processing** — always run on all variations before showing to user.

**3.5.1 Compliance Check**

Load rules from `baoyu-content-review` skill:
- [common-rules.md](../baoyu-content-review/references/common-rules.md) — advertising law, exaggeration
- [x-twitter.md](../baoyu-content-review/references/platforms/x-twitter.md) — X/Twitter spam triggers

Scan each variation. If violations found, auto-fix in-place before output. No separate report needed for short-form content — just fix silently.

**3.5.2 AI Flavor Check**

Load rules from `baoyu-humanize` skill:
- [ai-patterns.md](../baoyu-humanize/references/ai-patterns.md) — AI writing patterns
- [platform-tone.md](../baoyu-humanize/references/platform-tone.md) — X tone section

Check each variation against AI patterns. Apply fixes:
- Remove filler connectors
- Fix template phrases
- Ensure tone matches X's casual, direct style
- Verify the smell test: "Could a real person have sent this as a casual message?"

Output the cleaned variations directly — user sees only the final versions.

### Step 4: Refine

If user wants changes:
- "更口语一点" → cut formal words, add hesitation ("好像", "感觉", "大概")
- "更短" → strip everything non-essential
- "加个结尾问题" → add one genuine question, not rhetorical bait
- "去掉hashtag" → remove
- Regenerate only what changed, not the whole thing

### Step 5: Attach Image (Optional)

After user selects a version, ask if they want to attach an image:

```
header: "Image"
question: "Want to attach an image to this post?"
options:
  - label: "No image"
    description: "Post text only"
  - label: "Generate image"
    description: "Generate an image matching the post content"
  - label: "Screenshot / existing file"
    description: "Use a file you already have"
```

**If "Generate image"**:
1. Derive a brief image prompt from the post content
2. Call `baoyu-image-gen` skill (or `baoyu-cover-image` for polished visuals):
   - Aspect ratio: 16:9 (landscape) for single image, 1:1 for quote cards
   - Style: minimal or flat-vector (clean, professional)
3. Save image alongside the post or in current directory
4. Report image path to user

**If "Screenshot / existing file"**:
- User provides file path → attach when publishing via `baoyu-post-to-x`

Skip this step entirely if user already specified "no image" or context makes it clear (e.g., quick thought, reply).

---

## Length Guide

| Type | Characters | When |
|------|-----------|------|
| Short | 60–120 | Casual thought, milestone |
| Medium | 120–220 | Tool review, daily tinkering |
| Thread opener | 100–160 + [🧵] | Complex topic, multi-part |

Chinese characters count as ~2 English chars for X display. Keep under 280 English-equivalent.

---

## Output Format

Write the post directly — no preamble like "好的，这是我为你写的推文：".

Just output the variations, clearly separated:

```
版本一
[post text]

版本二
[post text]

版本三
[post text]
```

After writing, wait for feedback. Don't suggest which version is best unless asked.

---

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.