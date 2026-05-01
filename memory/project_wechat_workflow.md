# Project WeChat Workflow Memory

This project uses `baoyu-wechat-mp-writer` as the orchestration skill for WeChat Official Account articles.

## Required Chain

For a full creation workflow:

1. `baoyu-trend-scout` for topic discovery when needed.
2. `baoyu-wechat-mp-writer` for title candidates and outline.
3. Wait for user confirmation of title.
4. Wait for user confirmation of outline.
5. Draft the article.
6. Run `baoyu-humanize` with:
   - `target_platform: wechat`
   - `preserve_structure: true`
   - `intensity: medium`
7. Run `baoyu-content-review` for WeChat compliance before visuals or publishing.
8. Generate article illustrations via `baoyu-article-illustrator`.
9. Generate cover via `baoyu-cover-image`.
10. Convert to WeChat-compatible HTML via `baoyu-markdown-to-html` if publishing.
11. Publish draft via `baoyu-post-to-wechat` only when requested.

## Brand / Author

- Default WeChat author: `檀奕的成长笔记`.
- Default image watermark for generated cover and illustration images: `檀奕的成长笔记`.

## Image Generation Rule

Use direct Agent/host image generation first for all cover and article illustration steps.

- Do not run `baoyu-image-gen` merely because a workflow has an output path such as `cover.png` or `01-xxx.png`.
- Use `baoyu-image-gen` only when direct image output is unavailable, or when the user explicitly requests API/provider generation, local-file automation, or batch script generation.
- Do not use `baoyu-danger-gemini-web` for image generation unless the user explicitly requests Gemini Web reverse-engineered generation.
- If direct image generation returns images in a temporary/default generated-images directory, move the final assets into the article's dated content folder as the canonical copies.
- After verifying the images exist in the article folder, remove temporary/default generated-images copies for that article unless the user explicitly asks to keep them.

## Output Directory

Create daily content under:

`wechat-content/微信公众号-YYYY-MM-DD/<topic-slug>/`

Keep intermediate files:

- `*-draft.md`
- `*-humanized.md`
- `*-reviewed.md`
- `content-review-report.md`
- `illustrations/outline.md`
- `illustrations/prompts/*.md`
- `cover/prompts/cover.md`

Canonical image assets:

- Cover: `cover/cover.png`
- Article illustrations: `illustrations/NN-{type}-{slug}.png`
- Temporary generated image directories are not canonical storage.

## Current Decision

As of 2026-04-26, the project decision is:

Direct image output is the default for the WeChat writing chain. `baoyu-image-gen` is a fallback, and `baoyu-danger-gemini-web` is opt-in only.

Generated image assets must end up under the corresponding article folder for the creation date, not left in external generated image cache directories.
