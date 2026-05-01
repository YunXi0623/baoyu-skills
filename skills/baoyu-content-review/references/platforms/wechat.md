---
name: wechat-rules
description: WeChat Official Account platform-specific prohibited words and content rules
---

# WeChat Rules（微信公众号违规规则）

## 1. Induced Sharing（诱导分享/关注）

Severity: **High** — may get article blocked or account penalized

| Prohibited | Why | Suggested Replacement |
|-----------|-----|----------------------|
| 分享到朋友圈 | Induced sharing violation | Remove |
| 转发有礼 / 分享领红包 | Incentivized sharing | Remove |
| 不转不是中国人 | Emotional manipulation + political | Remove entirely |
| 关注后回复XX获取 | Forced follow pattern | "欢迎关注获取更多内容" |
| 阅读原文领取 | Forced click pattern | Provide value directly |
| 长按识别二维码 | External traffic diversion | Use built-in follow button |

## 2. Clickbait Title Patterns（标题党）

Severity: **Medium** — WeChat actively penalizes clickbait

| Pattern | Example | Fix |
|---------|---------|-----|
| Shock openers | 震惊！/ 重磅！/ 突发！ | Be specific about the news |
| Curiosity gap abuse | "看到第3条我哭了" | State the value directly |
| False celebrity association | "马云说..." (without source) | Remove or cite real source |
| Emotional manipulation | "不看后悔一辈子" | Remove |
| Excessive punctuation | ！！！？？？ | Max 1 per sentence |

## 3. External Link Restrictions（外链限制）

Severity: **Medium**

| Restricted | Notes |
|-----------|-------|
| Taobao / JD links | Blocked in articles since 2021 |
| Competitor platform links | Douyin, Kuaishou links may be throttled |
| URL shorteners | bit.ly, t.cn etc. may trigger spam filter |
| QR codes to non-WeChat | May be flagged |

Suggested: Use WeChat mini-programs or internal links where possible.

## 4. Sensitive Content Categories（敏感内容）

Severity: **High**

| Category | Rules |
|----------|-------|
| Political content | Must follow official narrative; avoid speculation |
| Religious content | No proselytizing or sectarian content |
| Gambling / lottery | Strictly prohibited |
| Pornographic content | Strictly prohibited |
| Violence / gore | Restricted |
| Superstition | Fortune telling, feng shui promotions restricted |
| Fundraising | Must have proper qualification |

## 5. Advertising Compliance（广告合规）

Severity: **Medium to High**

| Rule | Details |
|------|---------|
| Ad labeling | Paid content must be marked as 广告 |
| Financial products | Must include risk disclaimers |
| Health products | Cannot claim medical effects |
| Education | Cannot guarantee exam results |
| Real estate | Cannot promise appreciation |

## 6. Account Safety Patterns（账号安全）

Behaviors that trigger WeChat risk control:
- Sudden spike in posting frequency
- Bulk copy-pasting same content
- Multiple accounts posting identical content
- Unusual login locations
- Automated posting tools (use official API instead)

## 7. WeChat-Specific Formatting Tips

Not prohibited, but affects readability and distribution:
- Optimal article length: 1500-3000 characters
- Use section breaks (---) for long articles
- Bold key phrases, not full sentences
- Images break up text every 3-4 paragraphs
- Summary/abstract in first 50 characters (shown in feed)
