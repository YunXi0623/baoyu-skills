---
name: ai-patterns
description: Comprehensive list of AI-generated writing patterns with detection rules and rewrite strategies
---

# AI Writing Patterns（AI 味特征清单）

## Chinese AI Patterns（中文 AI 味）

### Category 1: Template Openings（模板化开头）

**Detection**: First sentence matches common AI opener patterns.

| Pattern | Example | Rewrite Strategy |
|---------|---------|-----------------|
| 时代宣言 | "在当今数字化时代…" / "随着AI技术的发展…" | Replace with a specific moment, scene, or data point |
| 泛泛引入 | "今天给大家分享…" / "今天我们来聊聊…" | Start directly with the thing itself |
| 假设情境 | "你是否曾经���到过…" / "想象一下…" | Start with YOUR real experience |
| 定义开头 | "XX是指…" / "所谓XX就是…" | Skip definition, show it in action |

**Good openers**:
- 具体时间 + 动作："上周五下班后折腾了两小时..."
- 具体数据："第一笔付费到账，38美元。"
- 具体场景："打开电脑发现 API 又挂了。"
- 反直觉事实："这个免费工具比我付费的那个好用。"

### Category 2: Structural Clichés（结构套路）

**Detection**: Content follows a rigid template structure.

| Pattern | Signature | Rewrite Strategy |
|---------|-----------|-----------------|
| 总分总 | 引言 → 1.2.3. → 总结 | Break into narrative chunks, vary paragraph length |
| 三段论 | "首先...其次...最后..." | Remove markers, let flow carry the logic |
| 万能结构 | 是什么→为什么→怎么做 | Start from the "怎么做" (action) and weave in why |
| 对比模板 | 优点→缺点→结论 | Mix pros and cons within the narrative |

### Category 3: Filler Connectors（万能连接词）

**Detection**: Connectors that add no information.

| Filler | Replacement Options |
|--------|-------------------|
| 此外 / 另外 | 删掉，直接写下一句 |
| 值得一提的是 | 删掉，或 "有意思的是" |
| 不仅如此 | 删掉 |
| 与此同时 | 删掉，或 "同时" |
| 总的来说 / 综上所述 | 删掉整句 |
| 毫无疑问 | 删掉，或改为 "确实" |
| 事实上 / 实际上 | 偶尔可用，但���要每段都有 |
| 换句话说 | 删掉，直说 |

### Category 4: Tone Uniformity（语气均匀）

**Detection**: Every paragraph has similar length, similar sentence structure, similar emotional temperature.

**Rewrite strategy**:
- Mix sentence lengths: 短句。然后来一个稍微长一点的句子，带一点转折或者犹豫。再来个短的。
- Add personal reactions: "没想到" / "说实话" / "后来才发现"
- Include uncertainty: "我也不确定" / "可能是我的问题" / "还在观察"
- Break rhythm: Use a one-sentence paragraph for emphasis.

### Category 5: Over-Politeness（过度礼貌）

**Detection**: Phrases that only exist because AI is trained to be helpful.

| Kill These | Why |
|-----------|-----|
| 希望对你有所帮助 | Nobody says this in real life |
| 希望这篇文章能够给你带来一些启发 | Same |
| 如果你有任何问题，欢迎留言 | Generic CTA |
| 让我们一起来看看吧 | Fake enthusiasm |
| 感谢你的阅读 | Unnecessary |

### Category 6: Assumed Consensus（假设共鸣）

**Detection**: Claiming to know what "everyone" thinks.

| Pattern | Fix |
|---------|-----|
| 相信大家都… | → "我觉得" / "我的感受是" |
| 众所周知 | → 删掉，直接说事实 |
| 我们都知道 | → "可能你也注意到了" |
| 想必大家 | → 删掉 |

### Category 7: Emoji / Formatting Overuse（排版过度）

**Detection**: Excessive decorative elements.

| Pattern | Fix |
|---------|-----|
| Every section starts with emoji | Remove most, keep 0-2 total |
| 🔥🚀💡 clusters | Delete |
| Bold every other sentence | Bold only 2-3 key phrases per article |
| Bullet points for everything | Convert to flowing text where natural |

---

## English AI Patterns

| Pattern | Example | Fix |
|---------|---------|-----|
| "In today's rapidly evolving landscape" | Template opener | Cut, start with specific |
| "It's worth noting that" | Filler | Delete |
| "Let's dive in" / "Let's explore" | Fake enthusiasm | Just start |
| "In conclusion" / "To sum up" | Structural cliché | End naturally |
| "Game-changer" / "Revolutionary" | Hype word | Be specific about what changed |
| "Leverage" / "Utilize" | Corporate speak | Use "use" |
| "At the end of the day" | Cliché | Delete or rephrase |
| "It goes without saying" | Then don't say it | Delete |
| Passive voice overuse | "It can be seen that" | Use active voice |
| Perfect grammar throughout | Robotic feel | Allow minor informality |

---

## Rewrite Intensity Guide

### Light（轻度）
- Remove filler connectors
- Cut over-politeness phrases
- Fix template openings
- Preserve all structure and lists

### Medium（中度，默认）
- All light changes
- Break list-heavy sections into prose
- Add tone variation (mix long/short sentences)
- Replace assumed consensus with first person
- Restructure obvious template patterns

### Heavy（重度）
- Full rewrite preserving only facts and arguments
- Complete tone overhaul
- May reorganize entire structure
- Results read like a completely different author wrote it
