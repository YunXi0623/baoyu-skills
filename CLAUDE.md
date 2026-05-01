# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code marketplace plugin providing AI-powered content generation skills. Skills use Gemini Web API (reverse-engineered) for text/image generation and Chrome CDP for browser automation.

## Architecture

Skills are organized into three plugin categories in `marketplace.json`:

```
skills/
├── [content-skills]           # Content generation and publishing
│   ├── baoyu-xhs-images/          # Xiaohongshu infographic series (1-10 images)
│   ├── baoyu-cover-image/         # Article cover images (2.35:1 aspect)
│   ├── baoyu-slide-deck/          # Presentation slides with outlines
│   ├── baoyu-article-illustrator/ # Smart illustration placement
│   ├── baoyu-comic/               # Knowledge comics (Logicomix/Ohmsha style)
│   ├── baoyu-post-to-x/           # X/Twitter posting automation
│   └── baoyu-post-to-wechat/      # WeChat Official Account posting
│
├── [ai-generation-skills]     # AI-powered generation backends
│   └── baoyu-danger-gemini-web/   # Gemini API wrapper (text + image gen)
│
└── [utility-skills]           # Utility tools for content processing
    ├── baoyu-danger-x-to-markdown/ # X/Twitter content to markdown
    └── baoyu-compress-image/      # Image compression
```

**Plugin Categories**:
| Category | Description |
|----------|-------------|
| `content-skills` | Skills that generate or publish content (images, slides, comics, posts) |
| `ai-generation-skills` | Backend skills providing AI generation capabilities |
| `utility-skills` | Helper tools for content processing (conversion, compression) |

Each skill contains:
- `SKILL.md` - YAML front matter (name, description) + documentation
- `scripts/` - TypeScript implementations
- `prompts/system.md` - AI generation guidelines (optional)

## Running Skills

All scripts run via Bun (no build step):

```bash
npx -y bun skills/<skill>/scripts/main.ts [options]
```

Examples:
```bash
# Text generation
npx -y bun skills/baoyu-danger-gemini-web/scripts/main.ts "Hello"

# Image generation
npx -y bun skills/baoyu-danger-gemini-web/scripts/main.ts --prompt "A cat" --image cat.png

# From prompt files
npx -y bun skills/baoyu-danger-gemini-web/scripts/main.ts --promptfiles system.md content.md --image out.png
```

## Key Dependencies

- **Bun**: TypeScript runtime (via `npx -y bun`)
- **Chrome**: Required for `baoyu-danger-gemini-web` auth and `baoyu-post-to-x` automation
- **No npm packages**: Self-contained TypeScript, no external dependencies

## Authentication

`baoyu-danger-gemini-web` uses browser cookies for Google auth:
- First run opens Chrome for login
- Cookies cached in data directory
- Force refresh: `--login` flag

## Plugin Configuration

`.claude-plugin/marketplace.json` defines plugin metadata and skill paths. Version follows semver.

## Skill Loading Rules

**IMPORTANT**: When working in this project, follow these rules:

| Rule | Description |
|------|-------------|
| **Load project skills first** | MUST load all skills from `skills/` directory in current project. Project skills take priority over system/user-level skills with same name. |
| **Default image generation** | When the current Agent/host can generate images directly, use direct image output first. Use `skills/baoyu-image-gen/SKILL.md` only when direct output is unavailable or the user explicitly needs an API/provider workflow. Never use `baoyu-danger-gemini-web` for images unless the user explicitly requests Gemini Web. |

**Loading Priority** (highest → lowest):
1. Current project `skills/` directory
2. User-level skills (`$HOME/.baoyu-skills/`)
3. System-level skills

## Release Process

**IMPORTANT**: When user requests release/发布/push, ALWAYS use `/release-skills` workflow.

**Never skip**:
1. `CHANGELOG.md` + `CHANGELOG.zh.md` - Both must be updated
2. `marketplace.json` version bump
3. `README.md` + `README.zh.md` if applicable
4. All files committed together before tag

## Adding New Skills

**IMPORTANT**: All skills MUST use `baoyu-` prefix to avoid conflicts when users import this plugin.

**REQUIRED READING**: Before creating a new skill, read the official [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices).

### Key Requirements from Official Best Practices

| Requirement | Details |
|-------------|---------|
| **Concise is key** | Claude is smart—only add context it doesn't have. Challenge each token. |
| **name field** | Max 64 chars, lowercase letters/numbers/hyphens only, no "anthropic"/"claude" |
| **description field** | Max 1024 chars, non-empty, MUST be third person, include what + when to use |
| **SKILL.md body** | Keep under 500 lines; use separate files for additional content |
| **Naming convention** | Gerund form preferred (e.g., `processing-pdfs`), but `baoyu-` prefix required here |
| **References** | Keep one level deep from SKILL.md; avoid nested references |
| **No time-sensitive info** | Avoid dates/versions that become outdated |

### Steps

1. Create `skills/baoyu-<name>/SKILL.md` with YAML front matter
   - Directory name: `baoyu-<name>`
   - SKILL.md `name` field: `baoyu-<name>`
2. Add TypeScript in `skills/baoyu-<name>/scripts/`
3. Add prompt templates in `skills/baoyu-<name>/prompts/` if needed
4. **Choose the appropriate category** and register in `marketplace.json`:
   - `content-skills`: For content generation/publishing (images, slides, posts)
   - `ai-generation-skills`: For AI backend capabilities
   - `utility-skills`: For helper tools (conversion, compression)
   - If none fit, create a new category with descriptive name
5. **Add Script Directory section** to SKILL.md (see template below)

### Choosing a Category

| If your skill... | Use category |
|------------------|--------------|
| Generates visual content (images, slides, comics) | `content-skills` |
| Publishes to platforms (X, WeChat, etc.) | `content-skills` |
| Provides AI generation backend | `ai-generation-skills` |
| Converts or processes content | `utility-skills` |
| Compresses or optimizes files | `utility-skills` |

**Creating a new category**: If the skill doesn't fit existing categories, add a new plugin object to `marketplace.json` with:
- `name`: Descriptive kebab-case name (e.g., `analytics-skills`)
- `description`: Brief description of the category
- `skills`: Array with the skill path

### Writing Effective Descriptions

**MUST write in third person** (not "I can help you" or "You can use this"):

```yaml
# Good
description: Generates Xiaohongshu infographic series from content. Use when user asks for "小红书图片", "XHS images", or "RedNote infographics".

# Bad
description: I can help you create Xiaohongshu images
description: You can use this to generate XHS content
```

Include both **what** the skill does and **when** to use it (triggers/keywords).

### Script Directory Template

Every SKILL.md with scripts MUST include this section after Usage:

```markdown
## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Script path = `${SKILL_DIR}/scripts/<script-name>.ts`
3. Replace all `${SKILL_DIR}` in this document with the actual path

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | Main entry point |
| `scripts/other.ts` | Other functionality |
```

When referencing scripts in workflow sections, use `${SKILL_DIR}/scripts/<name>.ts` so agents can resolve the correct path.

### Progressive Disclosure

For skills with extensive content, use separate reference files:

```
skills/baoyu-example/
├── SKILL.md              # Main instructions (<500 lines)
├── references/
│   ├── styles.md         # Style definitions (loaded as needed)
│   └── examples.md       # Usage examples (loaded as needed)
└── scripts/
    └── main.ts           # Executable script
```

In SKILL.md, link to reference files (one level deep only):
```markdown
**Available styles**: See [references/styles.md](references/styles.md)
**Examples**: See [references/examples.md](references/examples.md)
```

## Code Style

- TypeScript throughout, no comments
- Async/await patterns
- Short variable names
- Type-safe interfaces

## Image Generation Guidelines

Skills that require image generation MUST use the current Agent/host's direct image output first when available. Do not route image generation through CLI/API skills merely because a workflow wants an output file.

### Image Generation Skill Selection

**Default**: Use direct image output from the current Agent/host when available.

1. Generate the requested cover/illustration images directly from the saved prompt or visual brief.
2. If the user explicitly requires a local API/provider workflow, or direct output is unavailable, use `skills/baoyu-image-gen/SKILL.md`.
3. Do not use `skills/baoyu-danger-gemini-web/SKILL.md` for images unless the user explicitly says to use Gemini Web.
4. If a local file is required but direct image output does not provide a path, report that direct generation produced the asset and ask before falling back to CLI/API generation.

### Generation Flow Template

Use this template when implementing image generation in skills:

```markdown
### Step N: Generate Images

**Skill Selection**:
1. Prefer current Agent/host direct image output.
2. Use `baoyu-image-gen` only if direct output is unavailable or an explicit API/provider workflow is needed.
3. Never default to `baoyu-danger-gemini-web` for image generation.

**Generation Flow**:
1. Generate images directly from the saved prompt file or visual brief.
2. Generate images sequentially (one at a time), unless the user explicitly requests parallel generation.
3. If direct generation fails or is unavailable, ask before falling back to `baoyu-image-gen`.
4. On failure, auto-retry once before reporting error.
```

### Output Path Convention — Platform Content Directories

Content for three target platforms is stored in dedicated root-level directories, organized by date and sequence number:

| Platform | Root Directory | Description |
|----------|---------------|-------------|
| WeChat (微信公众号) | `wechat-content/` | Long-form articles, HTML, cover images |
| Xiaohongshu (小红书) | `xhs-content/` | Infographic series, short copy |
| X (Twitter) | `x-content/` | Short posts, threads, images |

**Directory Structure**:
```
<platform-dir>/YYYY-MM-DD/NN-<topic-slug>/
```
- `YYYY-MM-DD`: Creation date
- `NN`: Two-digit sequence number per day (01, 02, 03...), supports multiple posts per day
- `<topic-slug>`: 2-4 words, kebab-case, derived from content topic

**Example**:
```
wechat-content/
  2026-04-11/
    01-claude-写测试用例/
    02-gpt4o-免费开放/

xhs-content/
  2026-04-11/
    01-ai-测试效率/
    02-claude-vs-chatgpt/

x-content/
  2026-04-11/
    01-claude-update/
    02-ai-coding-tip/
```

**Sequence Number Rules**:
- Check existing subdirectories under `YYYY-MM-DD/` to determine next available number
- Always zero-padded two digits (01-99)
- Numbers are per-platform, per-day independent

**Source Files**:
- Copy all sources into the content directory with naming: `source-{slug}.{ext}`
- Multiple sources supported: text, images, files from conversation
- Examples:
  - `source-article.md` (main text content)
  - `source-reference.png` (image from conversation)
  - `source-data.csv` (additional file)
- Original source files remain unchanged

**Legacy Output Directories**: `xhs-images/`, `comic/`, `infographic/`, `illustrations/`, `articles/` etc. are legacy output paths. New content creation MUST use the platform directories above.

### Image Naming Convention

Image filenames MUST include meaningful slugs for readability:

**Format**: `NN-{type}-[slug].png`
- `NN`: Two-digit sequence number (01, 02, ...)
- `{type}`: Image type (cover, content, page, slide, illustration, etc.)
- `[slug]`: Descriptive kebab-case slug derived from content

**Examples**:
```
01-cover-ai-future.png
02-content-key-benefits.png
03-page-enigma-machine.png
04-slide-architecture-overview.png
```

**Slug Rules**:
- Derived from image purpose or content (kebab-case)
- Must be unique within the output directory
- 2-5 words, concise but descriptive
- When content changes significantly, update slug accordingly

### Best Practices

- Always read the image generation skill's SKILL.md before calling
- Pass parameters exactly as documented in the skill
- Handle failures gracefully with retry logic
- Provide clear progress feedback to user

## Style Maintenance (baoyu-comic)

When adding, updating, or deleting styles for `baoyu-comic`, follow this workflow:

### Adding a New Style

1. **Create style definition**: `skills/baoyu-comic/references/styles/<style-name>.md`
2. **Update SKILL.md**:
   - Add style to `--style` options table
   - Add auto-selection entry if applicable
3. **Generate showcase image**:
   ```bash
   # Prefer direct image output from the current Agent/host.
   # If direct output is unavailable or an API/provider workflow is required:
   npx -y bun skills/baoyu-image-gen/scripts/main.ts \
     --prompt "A single comic book page in <style-name> style showing [appropriate scene]. Features: [style characteristics from style definition]. 3:4 portrait aspect ratio comic page." \
     --image screenshots/comic-styles/<style-name>.png --ar 3:4
   ```
4. **Compress to WebP**:
   ```bash
   npx -y bun skills/baoyu-compress-image/scripts/main.ts screenshots/comic-styles/<style-name>.png
   ```
5. **Update both READMEs** (`README.md` and `README.zh.md`):
   - Add style to `--style` options
   - Add row to style description table
   - Add image to style preview grid

### Updating an Existing Style

1. **Update style definition**: `skills/baoyu-comic/references/styles/<style-name>.md`
2. **Regenerate showcase image** (if visual characteristics changed):
   - Follow steps 3-4 from "Adding a New Style"
3. **Update READMEs** if description changed

### Deleting a Style

1. **Delete style definition**: `skills/baoyu-comic/references/styles/<style-name>.md`
2. **Delete showcase image**: `screenshots/comic-styles/<style-name>.webp`
3. **Update SKILL.md**:
   - Remove from `--style` options
   - Remove auto-selection entry
4. **Update both READMEs**:
   - Remove from `--style` options
   - Remove from style description table
   - Remove from style preview grid

### Style Preview Grid Format

READMEs use 3-column tables for style previews:

```markdown
| | | |
|:---:|:---:|:---:|
| ![style1](./screenshots/comic-styles/style1.webp) | ![style2](./screenshots/comic-styles/style2.webp) | ![style3](./screenshots/comic-styles/style3.webp) |
| style1 | style2 | style3 |
```

## Extension Support

Every SKILL.md MUST include two parts for extension support:

### 1. Load Preferences Section (in Step 1 or as "Preferences" section)

For skills with workflows, add as Step 1.1. For utility skills, add as "Preferences (EXTEND.md)" section before Usage:

```markdown
**1.1 Load Preferences (EXTEND.md)**

Use Bash to check EXTEND.md existence (priority order):

\`\`\`bash
# Check project-level first
test -f .baoyu-skills/<skill-name>/EXTEND.md && echo "project"

# Then user-level (cross-platform: $HOME works on macOS/Linux/WSL)
test -f "$HOME/.baoyu-skills/<skill-name>/EXTEND.md" && echo "user"
\`\`\`

┌────────────────────────────────────────────┬───────────────────┐
│                    Path                    │     Location      │
├────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/<skill-name>/EXTEND.md       │ Project directory │
├────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/<skill-name>/EXTEND.md │ User home         │
└────────────────────────────────────────────┴───────────────────┘

┌───────────┬───────────────────────────────────────────────────────────────────────────┐
│  Result   │                                  Action                                   │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Found     │ Read, parse, display summary                                              │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Not found │ Ask user with AskUserQuestion (see references/config/first-time-setup.md) │
└───────────┴───────────────────────────────────────────────────────────────────────────┘

**EXTEND.md Supports**: [List supported configuration options for this skill]

Schema: `references/config/preferences-schema.md`
```

### 2. Extension Support Section (at the end)

Simplified section that references the preferences section:

```markdown
## Extension Support

Custom configurations via EXTEND.md. See **Step 1.1** for paths and supported options.
```

Or for utility skills without workflow steps:

```markdown
## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
```

**Notes**:
- Replace `<skill-name>` with actual skill name (e.g., `baoyu-cover-image`)
- Use `$HOME` instead of `~` for cross-platform compatibility (macOS/Linux/WSL)
- Use `test -f` Bash command for explicit file existence check
- ASCII tables for clear visual formatting

## WeChat Content Creation (微信公众号写作)

When user asks to write articles, create content, or publish to WeChat (keywords: 写文章、公众号、发布、写作、草稿箱), follow this workflow:

1. **Read memory file first**: Load `memory/project_wechat_workflow.md` for full workflow details
2. **Create daily directory**: `wechat-content/微信公众号-YYYY-MM-DD/`
3. **Execute orchestration skill**: `baoyu-wechat-mp-writer` (internally calls `baoyu-humanize` → `baoyu-content-review` → `baoyu-article-illustrator` → `baoyu-cover-image` → `baoyu-markdown-to-html` → `baoyu-post-to-wechat`)
4. **Image generation rule**: In illustration/cover steps, direct Agent/host image output comes before any CLI/API backend. Do not run `baoyu-image-gen` just because an output path exists, and never use `baoyu-danger-gemini-web` unless explicitly requested.
5. **All outputs** go into the daily directory

## Content Post-Processing Rule (内容后处理规则)

**IMPORTANT**: After ANY content generation skill produces text content, ALWAYS run these two steps before publishing or showing final output:

1. **baoyu-humanize**: Remove AI-generated patterns and polish for natural tone (load rules from skill's references/)
2. **baoyu-content-review**: Scan the final wording for prohibited words and compliance risks (load rules from skill's references/)

This applies to: `baoyu-article-writer`, `baoyu-x-copywriter`, `baoyu-xhs-images`, and any future writing skills. `baoyu-wechat-mp-writer` already orchestrates these steps internally.
