---
name: baoyu-trend-scout
description: Scouts the latest trends and news in a specified domain/industry, then recommends 3 high-potential topic directions for articles or posts. Combines WebSearch with targeted URL scraping for comprehensive trend analysis. Use when user asks to "find trending topics", "热点选题", "选题方向", "热门话题", "发现热点", or wants to discover trending content ideas for X/Twitter or WeChat.
---

# Trend Scout

Researches the latest trends in any domain/industry and recommends 3 high-potential topic directions — with hooks, reasoning, and content outlines tailored for X/Twitter and WeChat Official Account.

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-trend-scout/EXTEND.md && echo "project"

# Then user-level (cross-platform: $HOME works on macOS/Linux/WSL)
test -f "$HOME/.baoyu-skills/baoyu-trend-scout/EXTEND.md" && echo "user"
```

┌──────────────────────────────────────────────────┬───────────────────┐
│                       Path                       │     Location      │
├──────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-trend-scout/EXTEND.md        │ Project directory │
├──────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-trend-scout/EXTEND.md  │ User home         │
└──────────────────────────────────────────────────┴───────────────────┘

┌───────────┬──────────────────────────────────────────────────────────────────────┐
│  Result   │                               Action                                 │
├───────────┼──────────────────────────────────────────────────────────────────────┤
│ Found     │ Read, parse, display summary of loaded preferences                   │
├───────────┼──────────────────────────────────────────────────────────────────────┤
│ Not found │ Proceed with defaults; ask user inline for domain and platform        │
└───────────┴──────────────────────────────────────────────────────────────────────┘

**EXTEND.md Supports**:
- `default_domain`: Default industry/domain to scout (e.g., "AI", "电商")
- `default_platform`: `x`, `wechat`, or `both` (default: `both`)
- `default_language`: `zh`, `en`, or `both` (default matches domain language)
- `news_sources`: List of preferred URLs to scrape (one per line)
- `excluded_sources`: Domains to skip in search results
- `time_window_hours`: Hours to look back for news (default: `48`, min: `24`)

## Workflow

### Step 1: Load Preferences & Collect Input

**1.1 Load Preferences**

Check EXTEND.md (see Preferences section above). If found, parse and display a one-line summary of loaded settings.

**1.2 Collect Input**

If the user already provided the domain in their request, use it directly. Otherwise ask:

- **Domain/industry**: What field to research? (e.g., "AI Agent", "新能源汽车", "独立开发")
- **Target platform**: X/Twitter, WeChat Official Account, or both?
- **News source URLs** (optional): Any specific sites or articles to check? (e.g., 36kr, Hacker News, tech blogs)

If EXTEND.md provides `default_domain` or `default_platform`, pre-fill those and skip asking.

**1.3 Check Previous Reports (Deduplication)**

Before searching, check if previous reports exist for this domain:

```bash
ls trend-scout/{domain-slug}/report-*.md 2>/dev/null | sort -r | head -5
```

If reports exist:
1. Read the most recent report's **Topic Proposals** section
2. Extract the topic names/themes already covered
3. Keep this list as `known_topics` — any new topic that substantially overlaps with `known_topics` will be deprioritized in Step 3
4. Note in the final report: "Previously covered: [topic list]"

If no reports exist, proceed normally.

### Step 2: Search Phase (Two-pronged)

**Time window**: Target news and discussions from the **past 24–48 hours** (use `time_window_hours` from EXTEND.md if set). Determine the cutoff timestamp before searching:

```
cutoff = now() - 48h   # or time_window_hours if configured
date_today = YYYY-MM-DD
date_yesterday = YYYY-MM-DD (day before)
```

Run both approaches in sequence. Collect all raw findings before analysis.

**2A. WebSearch** — Run 4–6 targeted queries with time-bounded terms:

| Query Pattern | Purpose |
|---------------|---------|
| `{domain} news today {date_today}` | Today's breaking news |
| `{domain} 最新资讯 {date_today} OR {date_yesterday}` | Chinese-language same-day news |
| `{domain} trending last 24 hours` | Short-window engagement signal |
| `{domain} 今日热点 {date_today}` | Chinese hot topics today |
| `{domain} viral X Twitter {date_today}` | X engagement in the last day |
| `{domain} 爆文 公众号 最新` | WeChat viral (recency signal) |

**When evaluating results**: Discard any item whose publication date (or event date) is older than 48 hours from now. If a search result has no visible date, treat it as low-confidence for timeliness.

Adapt queries to match domain language (Chinese domains → more Chinese queries; English domains → more English queries).

**2B. URL Scraping** (if sources available):

Sources priority:
1. URLs provided by user in this session
2. `news_sources` from EXTEND.md
3. Default sources based on domain language:
   - Chinese domain → `https://36kr.com`, `https://www.woshipm.com`
   - English domain → `https://news.ycombinator.com`, `https://techcrunch.com`
   - AI domain → `https://news.ycombinator.com`, `https://36kr.com/information/AI`

For each URL, invoke the `baoyu-url-to-markdown` skill:

```
Read baoyu-url-to-markdown SKILL.md for its script path, then run:
npx -y bun ${SKILL_DIR}/scripts/main.ts <url>
```

Collect the markdown output from each page. Skip failed URLs (network error, timeout) and note them as unavailable.

### Step 3: Trend Analysis

Synthesize all search results and scraped content. For each candidate trend, score on 5 dimensions:

| Dimension | Weight | Question |
|-----------|--------|---------|
| **Timeliness** (时效性) | ★★★★★ | Did this emerge or spike in the **past 24–48 hours**? |
| **Engagement signal** (互动性) | ★★★★ | Are people actively discussing/searching this? |
| **Unique angle** (差异化) | ★★★ | Is there a fresh perspective not yet covered? |
| **Platform fit** (平台适配) | ★★★ | Does this suit the target platform's audience and format? |
| **Feasibility** (可写性) | ★★★ | Can a content creator produce this without proprietary data? |

Rank candidates and select the **top 3**. Prefer topics that score high on Timeliness + Engagement; break ties with Platform fit.

**Deduplication filter**: Before finalizing, cross-check each candidate against `known_topics` from Step 1.3. If a candidate substantially overlaps (same event, same angle), skip it and pick the next-ranked candidate instead. A topic is "substantially overlapping" if it covers the same triggering event AND the same content angle — similar themes from a fresh angle are acceptable.

### Step 4: Generate 3 Topic Proposals

Output each proposal in the following format:

---

### 选题 N：[主题名]

**热度评分**: [★ score, e.g., ★★★★☆] ([N]/10)

**热点原因**（为什么现在热）:
[2–3 sentences: recent trigger event + industry/social context + audience emotional resonance]

**X 平台标题钩子**（3个候选）:
- [Hook 1 — direct/provocative, ≤280 chars]
- [Hook 2 — question-based, ≤280 chars]
- [Hook 3 — data/contrast-led, ≤280 chars]

**微信公众号标题**（3个候选）:
- [Title 1 — builds curiosity or suspense]
- [Title 2 — promises clear value/insight]
- [Title 3 — counter-intuitive or bold claim]

**内容框架大纲**:
1. 开篇：[Hook design — scene, question, or surprising fact]
2. [Core section 1 — context/background]
3. [Core section 2 — main argument or insight]
4. [Core section 3 — case study, data, or contrast]
5. 结尾：[CTA / open question / leave audience thinking]

**差异化角度**: [How this topic can stand out from existing coverage — specific angle, lens, or persona]

---

Skip sections that don't apply to the selected platform (e.g., omit 微信 titles when platform is X-only).

### Step 5: Save & Present Report

**5.1 Determine output path**

- Slug: 2–4 words kebab-case from domain name (e.g., "AI Agent" → `ai-agent`)
- Path: `trend-scout/{domain-slug}/report-{YYYYMMDD}.md`
- If file exists: append timestamp `report-{YYYYMMDD}-{HHMMSS}.md`

**5.2 Report content**

Save the full report as markdown:

```markdown
# Trend Scout Report: {Domain}

**Date**: {YYYY-MM-DD HH:MM}
**Domain**: {domain}
**Platform**: {platform}
**Time window**: past {time_window_hours}h (cutoff: {cutoff datetime})
**Sources searched**: {N WebSearch queries + M URLs scraped}
**Previously covered** (skipped): {topic list from known_topics, or "none"}

## Search Summary
[Brief paragraph: key themes found, notable events, data points — all within the time window]

## Topic Proposals

{[3 proposals from Step 4]}

## Raw Sources
[List of all URLs fetched and search queries run]
```

**5.3 Present to user**

Output the report directly in the conversation (do not just say "saved to file"). Then show the file path.

## Output Example Path

```
trend-scout/ai-agent/report-20260301.md
```

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
