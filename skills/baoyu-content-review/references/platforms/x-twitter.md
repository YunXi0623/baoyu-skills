---
name: x-twitter-rules
description: X (Twitter) platform-specific content rules and spam trigger patterns
---

# X/Twitter Rules（X 平台违规规则）

## 1. Spam Trigger Patterns（垃圾信息触发）

Severity: **High** — may result in account suspension

| Pattern | Why | Fix |
|---------|-----|-----|
| Identical tweets posted repeatedly | Duplicate content detection | Vary wording each time |
| Mass-mentioning users | Spam behavior | Limit @mentions to 2-3 per tweet |
| Aggressive follow/unfollow | Bot behavior | Organic growth only |
| Bulk DM with links | Spam | Don't auto-DM |
| Too many hashtags | Spam signal | Max 2-3 hashtags |
| URL shorteners (bulk) | Associated with spam | Use full URLs or Twitter cards |

## 2. Automation Detection（自动化检测）

Severity: **Medium to High**

| Behavior | Risk Level | Notes |
|----------|-----------|-------|
| Posting at exact same time daily | Medium | Vary by 15-30 min |
| Identical post format every time | Medium | Mix up structure |
| Auto-replying to mentions | Medium | Add human variation |
| Posting > 50 tweets/day | High | Pace to 10-20 max |
| Identical thread structure | Low | Vary thread length/style |

When using `baoyu-post-to-x` skill, these are mitigated by Chrome CDP approach, but content patterns still matter.

## 3. Sensitive Content Labels（敏感内容标签）

Severity: **Medium** — content gets labeled, not removed

| Content Type | Result |
|-------------|--------|
| Graphic violence | Sensitivity label, reduced reach |
| Adult/sexual content | Age-gated, reduced reach |
| Hateful conduct | Account penalty |
| Misleading info | Community notes, reduced reach |

## 4. Copyright / IP Issues（版权问题）

Severity: **Medium**

| Issue | Fix |
|-------|-----|
| Posting others' images without credit | Add source/credit |
| Screenshotting full articles | Summarize + link to original |
| Using copyrighted music in videos | Use royalty-free music |
| Reposting without attribution | Quote tweet or credit |

## 5. Platform-Specific Terms to Watch（中文用户注意）

For Chinese-language tweets:

| Pattern | Risk | Notes |
|---------|------|-------|
| 翻墙 / VPN / 科学上网 | Low on X itself | But may affect linked content |
| Direct income claims | Medium | "月入X万" without context looks spammy |
| Bulk promotional links | High | Space out promotional content |
| 互关 / 互粉 / follow4follow | Medium | Looks like bot behavior |

## 6. Engagement Best Practices

Not rules, but affect reach:

| Practice | Why |
|----------|-----|
| Reply to comments on your posts | Algorithm rewards engagement |
| Don't delete and repost same content | Deletion patterns flagged |
| Mix content types (text, image, thread) | Algorithm rewards variety |
| Engage with others' content genuinely | Builds organic reach |
| Post during audience active hours | Better initial engagement |

## 7. X/Twitter Character Limits

| Content | Limit |
|---------|-------|
| Regular tweet | 280 characters |
| Chinese characters | ~1 CJK char = ~2 English chars in display |
| Thread | No limit on number of tweets |
| X Article | Long-form, no character limit |
| Image alt text | 1000 characters |
