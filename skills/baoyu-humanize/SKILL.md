---
name: baoyu-humanize
description: Removes AI-generated flavor from content and polishes it to read like authentic human writing. Detects and rewrites robotic patterns, repetitive structures, and formulaic expressions. Use when user asks to "去AI味", "humanize", "润色", "让文章更自然", "polish", or after AI-generated content needs polishing.
---

# Humanize（去 AI 味润色）

Detects AI-generated writing patterns and rewrites content to sound like a real person wrote it. Works on Chinese and English content across all platforms.

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-humanize/EXTEND.md && echo "project"

# Then user-level
test -f "$HOME/.baoyu-skills/baoyu-humanize/EXTEND.md" && echo "user"
```

┌─────────────────────────────────────────────────┬───────────────────┐
│                      Path                       │     Location      │
├──────────────────────────────���──────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-humanize/EXTEND.md          │ Project directory │
├─────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-humanize/EXTEND.md    │ User home         │
└─────────────────────────────────────────────────┴───────────────────┘

┌───────────┬────────────────────────────────────────┐
│  Result   │                Action                  │
├───────────┼────────────────────────────────────────┤
│ Found     │ Read, parse, apply style preferences   │
├───────────┼────────────────────────────────────────┤
│ Not found │ Use defaults                           │
└───────────┴────────────────────────────────────────┘

**EXTEND.md Supports**:
- `intensity`: light / medium (default) / heavy — how aggressively to rewrite
- `target_platform`: xiaohongshu / wechat / x — adapts tone accordingly
- `preserve_structure`: true/false — keep headings and list structure intact
- `author_voice`: brief description of desired writing personality

## AI Pattern Detection

Full detection rules and rewrite strategies: [references/ai-patterns.md](references/ai-patterns.md)

Platform-specific tone targets: [references/platform-tone.md](references/platform-tone.md)

### Quick Reference — What Gets Flagged

| AI Pattern | Example | Rewrite Direction |
|-----------|---------|-------------------|
| Template openings | "在当今数字化时代" | Replace with specific scene/fact |
| Summary-first structure | "首先...其次...最后..." | Break apart, use narrative flow |
| Hollow conclusions | "总的来说/综上所述" | Cut, or end with real feeling |
| List abuse | Everything in 1. 2. 3. 4. | Merge into paragraph prose |
| Flat tone | Every paragraph sounds the same | Add rhythm variation |
| Filler connectors | "此外/另外/值得一提的是" | Cut or use casual connectors |
| Over-politeness | "希望对你有所帮助" | Delete |
| Assumed consensus | "相信大家都..." | Switch to first person |
| Emoji overload | 🔥🚀💡✅ every paragraph | Max 1-2, or none |
| Perfect parallelism | Identical sentence structures | Vary length and rhythm |

## Workflow

### Step 1: Load Preferences (EXTEND.md)

Check EXTEND.md (see Preferences section). Note intensity level and target platform if configured.

### Step 2: Read Content

Accept input as:
- File path → read file
- Inline text → use directly
- Conversation context → use the most recent generated content

Preserve YAML frontmatter if present — do not modify metadata.

### Step 3: Detect AI Patterns

Scan the content and produce a brief detection summary:

```
## AI 味检测

发现 N 处 AI 味特征：
- 模板化开头：2 处
- 总分总结构：1 处
- 空洞连接词：4 处
- 语气过于均匀：整��

润色强度：[light/medium/heavy]
```

Do NOT show this as a blocking step — proceed directly to rewriting. Show the summary alongside the result.

### Step 4: Rewrite

Apply rewrites based on intensity:

| Intensity | What Changes | What Stays |
|-----------|-------------|------------|
| light | Filler words, template phrases, over-politeness | Structure, most sentences |
| medium (default) | Above + restructure parallel sections, add tone variation, break lists into prose | Core arguments, key data |
| heavy | Above + full rewrite maintaining only the ideas and facts | Only the meaning |

**Rewrite principles**:
- Keep the same information and arguments
- Do NOT add new claims or facts
- Do NOT remove factual content
- Change HOW things are said, not WHAT is said
- Add natural imperfections: shorter sentences mixed with longer ones, occasional rhetorical questions, personal asides

### Step 5: Output Comparison

Show key changes clearly. Do NOT show a full side-by-side (too long). Instead, highlight 3-5 most significant changes:

```
## 润色结果

### 主要修改

1. **开头**
   ~~在当今AI技术飞速发展的时代，越来越多的人开始关注AI工具的使用。~~
   → 上周试了个新工具，本来没抱什么期待，结果还真帮我省了不少事。

2. **第3段结构**
   ~~首先...其次...最后...~~
   → 改为叙事串联，去掉编号

3. **结尾**
   ~~总的来说，AI工具确实能够提升我们的工作效率，希望本文对你有所帮助。~~
   → 先用着看吧，过一阵再来说说到底好不好用。

[完整润色后内容见下方]
```

Then output the full rewritten content.

### Step 6: Save File

Save to `{filename}-humanized.md` by default.

If the input was from a previous skill's output (e.g., `xxx-reviewed.md`), ask whether to:
1. Save as new file (`-humanized.md`)
2. Overwrite the input file

Report saved path to user.

## The Smell Test

Before finalizing, ask yourself:

> "If I saw this in my WeChat feed / Xiaohongshu / X timeline, would I think a person wrote it or a bot?"

If it still sounds like a "content piece" rather than a "person talking" — one more pass.

## Notes

- This skill changes style, not substance — facts must remain accurate
- For publish-ready workflows, works best before a final `baoyu-content-review` pass (humanize first, then run compliance scan on the final wording)
- For platform-specific tone, specify the target platform for best results
- Frontmatter (YAML) is always preserved untouched

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
