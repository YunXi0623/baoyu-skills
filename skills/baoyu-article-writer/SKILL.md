---
name: baoyu-article-writer
description: Writes long-form WeChat Official Account articles (1500-3000 words) from trend topics, outlines, or ideas. Reads baoyu-trend-scout report files to expand a selected topic into a structured article. Use when user asks to "写公众号文章", "写文章", "写长文", "expand topic", or needs a full WeChat article from a trend direction or outline.
---

# Article Writer

Writes WeChat Official Account articles that read like a smart friend just shared something interesting — grounded, honest, conversational. No lecture format, no AI flavor, no front-loaded conclusions.

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-article-writer/EXTEND.md && echo "project"

# Then user-level (cross-platform: $HOME works on macOS/Linux/WSL)
test -f "$HOME/.baoyu-skills/baoyu-article-writer/EXTEND.md" && echo "user"
```

┌────────────────────────────────────────────────────┬───────────────────┐
│                       Path                         │     Location      │
├────────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-article-writer/EXTEND.md       │ Project directory │
├────────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-article-writer/EXTEND.md │ User home         │
└────────────────────────────────────────────────────┴───────────────────┘

┌───────────┬───────────────────────────────────────────────────────────────────┐
│  Result   │                             Action                                │
├───────────┼───────────────────────────────────────────────────────────────────┤
│ Found     │ Read, parse, display one-line summary of loaded preferences        │
├───────────┼───────────────────────────────────────────────────────────────────┤
│ Not found │ Proceed with defaults; ask for author_name inline if not in context│
└───────────┴───────────────────────────────────────────────────────────────────┘

**EXTEND.md Supports**:
- `author_name`: Author for article frontmatter
- `wechat_account_focus`: Account niche (e.g., "AI独立开发者") — calibrates angle and examples
- `target_length`: `short` (~1200w) / `medium` (~2000w, default) / `long` (~3000w)
- `style_notes`: Additional style guidance appended to Style DNA

## Style DNA（核心风格基因）

Long-form version of the grounded, friend-voice philosophy. Same DNA, extended to article length.

### What this feels like

- Opens with a specific moment, scene, data point, or contrast — never "今天给大家分享"
- Honest reactions woven in ("没想到", "有意思的是", "我当时第一反应是")
- Shows process including uncertainty ("我也不确定", "还在观察")
- Conclusions emerge from the narrative — never front-loaded
- Ends with breathing room: open question, unresolved observation, or just stops
- Bold only key phrases, not full sentences
- Short paragraphs: 2-4 sentences max (WeChat readability)
- H2 headings for sections; H3 used sparingly

### What this never does

| Forbidden pattern | Why banned |
|-------------------|------------|
| 干货 / 必看 / 超实用 | Bait language |
| 效率提升N倍 / 颠覆认知 | Exaggeration |
| 总结一下：1. 2. 3. | Lecture format |
| 关注我获取更多 | Promotional |
| 今天给大家分享… | Generic opener |
| Excessive emojis | AI flavor |
| Front-loaded conclusion | Kills curiosity |

### The smell test

Before finishing, ask: *"Would a smart friend who just researched this topic write it this way?"*

If it reads like a content marketing piece — rewrite it.

---

## Workflow

### Step 1: Load Preferences & Collect Input

**1.1 Load Preferences (EXTEND.md)**

Check EXTEND.md (see Preferences section). If found, display one-line summary (e.g., "Loaded: author=宝玉, length=medium, focus=AI独立开发者").

**1.2 Determine Input Source**

| Source | Detection | Action |
|--------|-----------|--------|
| trend-scout report | User provides `.md` file path + topic number | Read file → extract that topic's data |
| Direct outline | User provides topic + notes/outline | Use as-is |
| Minimal | Just a topic title | Ask for 2-3 key points or proceed with research |

When reading a trend-scout report, extract:
- `topic_name` (选题 N 标题)
- `hot_reason` (热点原因)
- `outline` (内容框架大纲 — 5 points)
- `differentiation_angle` (差异化角度)
- `wechat_titles` (微信公众号标题 3 candidates — offer user to pick or suggest new one)

### Step 2: Confirm Writing Brief

Present a compact brief, then proceed immediately unless user corrects:

```
📝 Writing Brief
Title: [selected/suggested title]
Angle: [differentiation angle]
Length: [target from EXTEND.md or default medium ~2000 words]
Author: [author_name or ask inline]

Outline:
1. [opening hook]
2-4. [core sections]
5. [ending]

Starting to write…
```

If user says nothing — start writing. No need for explicit "y" confirmation.

### Step 3: Write Article

Write in one pass, section by section. Do not announce sections ("now writing section 2") — write continuously.

**Article structure**:

| Section | Target Length | Notes |
|---------|--------------|-------|
| 开篇 Hook | 150-250 words | Specific scene/data/contrast. No preview of coming content. |
| 背景/现状 | 250-400 words | Why this matters now. Grounded in recent event or trend. |
| 核心洞察 | 400-600 words | 2-3 natural paragraphs, not a numbered list. |
| 案例/佐证 | 250-400 words | Concrete example, data, or contrast. Show don't tell. |
| 影响/实操 | 150-350 words | What this means for the reader. Practical but not preachy. |
| 结尾 | 80-150 words | Open question or unresolved thought. No CTA. |

Output the article directly in the conversation as it's being written.

### Step 4: Save to File

**Output path**:
- Slug: 2-4 words kebab-case from title
- Path: `articles/{slug}/{slug}.md`
- Conflict: append `-YYYYMMDD-HHMMSS` to slug

**YAML frontmatter** (prepend to saved file):

```yaml
---
title: [article title]
summary: [≤120 chars — first meaningful sentence or user-provided]
author: [from EXTEND.md or collected inline]
date: YYYY-MM-DD
cover_suggestion: [brief description for baoyu-cover-image]
tags: [2-4 tags]
source_topic: [trend-scout topic name, if applicable]
---
```

Report saved path to user. Do NOT auto-trigger baoyu-post-to-wechat.

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
