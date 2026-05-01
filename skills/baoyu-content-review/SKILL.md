---
name: baoyu-content-review
description: Scans content for platform-specific prohibited words, sensitive terms, and compliance risks. Supports Xiaohongshu, WeChat, and X/Twitter. Use when user asks to "审核内容", "check compliance", "违禁词检查", "敏感词", or before publishing to any platform.
---

# Content Review（内容合规审核）

Scans text for prohibited words, sensitive terms, and platform-specific compliance risks. Outputs a flagged-items report with suggested replacements, and optionally auto-fixes the content.

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-content-review/EXTEND.md && echo "project"

# Then user-level
test -f "$HOME/.baoyu-skills/baoyu-content-review/EXTEND.md" && echo "user"
```

┌──────────────────────────────────────────────────────┬───────────────────┐
│                         Path                         │     Location      │
├──────────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-content-review/EXTEND.md         │ Project directory │
├──────────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-content-review/EXTEND.md   │ User home         │
└─────────────────────────────────���────────────────────┴───────────────────┘

┌───────────┬────────────────────────────────────────┐
│  Result   │                Action                  │
├───────────┼────────────────────────────────────────┤
│ Found     │ Read, parse, apply custom word lists   │
├───────────┼────────────────────────────────────────┤
│ Not found │ Use built-in rules only                │
└───────────┴────────────────────────────────────────┘

**EXTEND.md Supports**:
- `custom_blocked_words`: Additional words to flag
- `whitelist`: Words to skip even if matched
- `default_platforms`: Default target platforms
- `strict_mode`: Flag borderline terms (default: false)

## Review Dimensions

| Dimension | Description | Reference |
|-----------|-------------|-----------|
| Advertising law | Absolute claims (最, 第一, 国家级) | [common-rules.md](references/common-rules.md) |
| Platform-specific | Throttle/ban trigger words | [platforms/](references/platforms/) |
| Traffic diversion | Contact info where prohibited | Platform references |
| Medical/financial | Efficacy promises, return guarantees | [common-rules.md](references/common-rules.md) |
| Political sensitivity | Politically sensitive content | [common-rules.md](references/common-rules.md) |
| Competitor brands | Direct mentions that trigger throttling | Platform references |

## Workflow

### Step 1: Load Preferences (EXTEND.md)

Check EXTEND.md (see Preferences section). If found, merge custom rules with built-in rules. Whitelist overrides all other rules.

### Step 2: Read Content

Accept input as:
- File path → read file
- Inline text → use directly
- Conversation context → use the most recent content

### Step 3: Confirm Target Platforms

Use AskUserQuestion if not specified:

```
header: "Platform"
question: "Which platforms to check compliance for?"
multiSelect: true
options:
  - label: "All platforms (Recommended)"
    description: "Xiaohongshu + WeChat + X/Twitter"
  - label: "Xiaohongshu"
    description: "小红书 content rules"
  - label: "WeChat"
    description: "微信公众号 content rules"
  - label: "X/Twitter"
    description: "X/Twitter content rules"
```

If user already specified platform(s), skip this step.

### Step 4: Load Platform Rules

Based on selected platforms, read the corresponding reference files:

| Platform | Reference File |
|----------|---------------|
| All | [references/common-rules.md](references/common-rules.md) |
| Xiaohongshu | [references/platforms/xiaohongshu.md](references/platforms/xiaohongshu.md) |
| WeChat | [references/platforms/wechat.md](references/platforms/wechat.md) |
| X/Twitter | [references/platforms/x-twitter.md](references/platforms/x-twitter.md) |

### Step 5: Scan Content

Scan content paragraph by paragraph against loaded rules. For each violation found, record:
- Location (paragraph number or line)
- Original text (the flagged phrase in context)
- Issue type (which rule category)
- Severity (high = likely blocked, medium = may throttle, low = borderline)
- Suggested replacement

### Step 6: Output Review Report

Format as a clear report:

```
## 审核报告

**文件**: [filename]
**目标平台**: [platforms]
**扫描结果**: 发现 N 处问题（高风险 X 处，中风险 Y 处，低风险 Z 处）

| # | 位置 | 原文 | 问题类型 | 风险等级 | 建议替换 |
|---|------|------|---------|---------|---------|
| 1 | 第2段 | "最好的AI工具" | 广告法绝对化用语 | 高 | "很好用的AI工具" |
| 2 | 第5段 | "加我微信" | 小红书引流违规 | 高 | "主页有联系方式" |
| ...

### 通过项
- ✅ 无医疗/金融风险词
- ✅ 无政治敏感内容
```

If no issues found:
```
## 审核报告

✅ 审核通过，未发现违规内容。
```

### Step 7: Auto-Fix (Optional)

After showing the report, ask:

```
header: "Fix"
question: "Auto-fix all flagged items?"
options:
  - label: "Auto-fix all (Recommended)"
    description: "Apply all suggested replacements"
  - label: "Fix high-risk only"
    description: "Only fix high-severity items"
  - label: "No fix"
    description: "Keep original, just use the report"
```

If user chooses to fix:
1. Apply replacements
2. Save to `{filename}-reviewed.md` (or overwrite if user specifies)
3. Show summary of changes made

## Notes

- Rules are guidelines, not exhaustive — platforms update policies frequently
- When in doubt, flag as medium risk and let user decide
- Always preserve the original file; fixes go to a new file by default
- Combine with `baoyu-humanize` for best results in publish-ready workflows: humanize first, then review the final wording

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
