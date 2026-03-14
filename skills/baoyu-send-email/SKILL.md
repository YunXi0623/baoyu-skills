---
name: baoyu-send-email
description: Sends email with Markdown content converted to styled HTML. Supports Resend API and SMTP (Gmail, QQ, 163, etc.). Use when user wants to "发送邮件", "send email", "把报告发给我", "email this to me", or needs to receive generated content by email.
---

# Email Sender

Sends Markdown files or inline text as styled HTML emails. Supports Resend API (zero-dep fetch) and SMTP with direct TLS or STARTTLS.

## Preferences (EXTEND.md)

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-send-email/EXTEND.md && echo "project"

# Then user-level (cross-platform: $HOME works on macOS/Linux/WSL)
test -f "$HOME/.baoyu-skills/baoyu-send-email/EXTEND.md" && echo "user"
```

┌──────────────────────────────────────────────────┬───────────────────┐
│                       Path                       │     Location      │
├──────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-send-email/EXTEND.md         │ Project directory │
├──────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-send-email/EXTEND.md   │ User home         │
└──────────────────────────────────────────────────┴───────────────────┘

┌───────────┬───────────────────────────────────────────────────────────────────────────┐
│  Result   │                                  Action                                   │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Found     │ Read, parse, display summary                                              │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Not found │ Ask user with AskUserQuestion to choose provider and enter credentials    │
└───────────┴───────────────────────────────────────────────────────────────────────────┘

**EXTEND.md Supports**: Provider selection | API key (Resend) | SMTP credentials | Default recipient

### Resend Config

```
provider: resend
api_key: re_xxxxxxxxxxxx
from: Your Name <you@yourdomain.com>
default_to: personal@email.com
```

### SMTP Config (QQ / Gmail / 163 / etc.)

```
provider: smtp
host: smtp.qq.com
port: 465
secure: true
user: your@qq.com
pass: your-app-password
from: Your Name <your@qq.com>
default_to: personal@email.com
```

`secure: true` → direct TLS (port 465). `secure: false` → STARTTLS (port 587).

## Usage

```bash
npx -y bun ${SKILL_DIR}/scripts/main.ts [options]
```

## Options

| Option | Description |
|--------|-------------|
| `--file <path>` | Markdown file to send as email body |
| `--body <text>` | Inline markdown body (alternative to --file) |
| `--to <email>` | Recipient (overrides default_to in EXTEND.md) |
| `--subject <text>` | Email subject (auto-derived from first H1 if omitted) |

## Examples

```bash
# Send a file (subject auto-derived from first # heading)
npx -y bun ${SKILL_DIR}/scripts/main.ts --file report.md

# Send with explicit recipient and subject
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --to user@example.com \
  --subject "Today's AI Trends" \
  --file trend-scout/ai-agent/report-20260301.md

# Send inline body
npx -y bun ${SKILL_DIR}/scripts/main.ts \
  --body "# Test\nHello world" --subject "Test"
```

**Output on success:**
```
✓ Sent to user@example.com (id: abc123)
```

## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Script path = `${SKILL_DIR}/scripts/<script-name>.ts`
3. Replace all `${SKILL_DIR}` in this document with the actual path

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | Main entry point — arg parsing, config loading, markdown→HTML, send routing |
| `scripts/smtp.ts` | Minimal SMTP client (direct TLS + STARTTLS, AUTH LOGIN) |

## Setup Guide

### Resend

1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Create an API key in dashboard
3. Verify a sending domain (or use `onboarding@resend.dev` for testing)
4. Set `api_key` in EXTEND.md

### SMTP — QQ Mail

1. Enable SMTP in QQ Mail settings → Generate app password
2. Use `host: smtp.qq.com`, `port: 465`, `secure: true`

### SMTP — Gmail

1. Enable 2FA → Generate App Password in Google Account
2. Use `host: smtp.gmail.com`, `port: 465`, `secure: true`

### SMTP — 163 Mail

1. Enable SMTP in 163 settings → Set client authorization password
2. Use `host: smtp.163.com`, `port: 465`, `secure: true`

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
