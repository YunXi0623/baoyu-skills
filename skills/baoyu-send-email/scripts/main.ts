import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { sendSmtp, type SmtpConfig, type MailOptions } from "./smtp.ts";

interface Args {
  to?: string;
  subject?: string;
  file?: string;
  body?: string;
}

interface Config {
  provider: "resend" | "smtp";
  from: string;
  default_to?: string;
  api_key?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const result: Args = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--to") result.to = args[++i];
    else if (args[i] === "--subject") result.subject = args[++i];
    else if (args[i] === "--file") result.file = args[++i];
    else if (args[i] === "--body") result.body = args[++i];
  }
  return result;
}

function parseExtendMd(content: string): Config {
  const cfg: Partial<Config> = {};
  for (const line of content.split("\n")) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const [, key, val] = m;
    if (key === "provider") cfg.provider = val.trim() as "resend" | "smtp";
    else if (key === "api_key") cfg.api_key = val.trim();
    else if (key === "from") cfg.from = val.trim();
    else if (key === "default_to") cfg.default_to = val.trim();
    else if (key === "host") cfg.host = val.trim();
    else if (key === "port") cfg.port = parseInt(val.trim(), 10);
    else if (key === "secure") cfg.secure = val.trim() === "true";
    else if (key === "user") cfg.user = val.trim();
    else if (key === "pass") cfg.pass = val.trim();
  }
  if (!cfg.provider) throw new Error("EXTEND.md missing required field: provider");
  if (!cfg.from) throw new Error("EXTEND.md missing required field: from");
  return cfg as Config;
}

function loadConfig(): Config {
  const projectPath = path.join(".baoyu-skills", "baoyu-send-email", "EXTEND.md");
  const userPath = path.join(os.homedir(), ".baoyu-skills", "baoyu-send-email", "EXTEND.md");

  for (const p of [projectPath, userPath]) {
    if (fs.existsSync(p)) {
      return parseExtendMd(fs.readFileSync(p, "utf-8"));
    }
  }
  throw new Error(
    "EXTEND.md not found. Create one at:\n" +
    `  ${projectPath}  (project-level)\n` +
    `  ${userPath}  (user-level)\n\n` +
    "See SKILL.md for config format."
  );
}

function inferSubject(markdown: string, explicit?: string): string {
  if (explicit) return explicit;
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Message";
}

function markdownToHtml(md: string): string {
  let html = md;

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre style="background:#f6f8fa;padding:12px 16px;border-radius:6px;overflow-x:auto;font-family:monospace;font-size:13px;line-height:1.5"><code>${escaped.trimEnd()}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 5px;border-radius:3px;font-family:monospace;font-size:0.9em">$1</code>');

  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:600;margin:20px 0 8px">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:20px;font-weight:600;margin:24px 0 10px;border-bottom:1px solid #eee;padding-bottom:6px">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:26px;font-weight:700;margin:0 0 20px">$1</h1>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#0070f3">$1</a>');

  html = html.replace(/^([ \t]*[-*+] .+\n?)+/gm, (block) => {
    const items = block.trim().split("\n").map((l) =>
      `<li style="margin:4px 0">${l.replace(/^[ \t]*[-*+] /, "").trim()}</li>`
    );
    return `<ul style="padding-left:20px;margin:8px 0">${items.join("")}</ul>`;
  });

  html = html.replace(/^([ \t]*\d+\. .+\n?)+/gm, (block) => {
    const items = block.trim().split("\n").map((l) =>
      `<li style="margin:4px 0">${l.replace(/^[ \t]*\d+\. /, "").trim()}</li>`
    );
    return `<ol style="padding-left:20px;margin:8px 0">${items.join("")}</ol>`;
  });

  html = html.replace(/^(?!<[huo]|<pre|<li)(.+)$/gm, (line) => {
    if (line.trim() === "") return "";
    return `<p style="margin:10px 0;line-height:1.7">${line}</p>`;
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#333;max-width:680px;margin:0 auto;padding:24px">
${html}
</body>
</html>`;
}

async function sendResend(cfg: Config, opts: MailOptions): Promise<string> {
  if (!cfg.api_key) throw new Error("EXTEND.md missing field: api_key");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${cfg.api_key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }

  const data = await res.json() as { id?: string };
  return data.id ?? "unknown";
}

async function main(): Promise<void> {
  const args = parseArgs();

  let cfg: Config;
  try {
    cfg = loadConfig();
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }

  let markdown: string;
  if (args.file) {
    if (!fs.existsSync(args.file)) {
      console.error(`File not found: ${args.file}`);
      process.exit(1);
    }
    markdown = fs.readFileSync(args.file, "utf-8");
  } else if (args.body) {
    markdown = args.body.replace(/\\n/g, "\n");
  } else {
    console.error("Provide --file <path> or --body <text>");
    process.exit(1);
  }

  const to = args.to ?? cfg.default_to;
  if (!to) {
    console.error("Recipient required: use --to <email> or set default_to in EXTEND.md");
    process.exit(1);
  }

  const subject = inferSubject(markdown, args.subject);
  const html = markdownToHtml(markdown);

  const opts: MailOptions = {
    from: cfg.from,
    to,
    subject,
    text: markdown,
    html,
  };

  try {
    let id: string;
    if (cfg.provider === "resend") {
      id = await sendResend(cfg, opts);
    } else {
      if (!cfg.host || !cfg.user || !cfg.pass) {
        console.error("SMTP config missing: host, user, or pass");
        process.exit(1);
      }
      const smtpCfg: SmtpConfig = {
        host: cfg.host,
        port: cfg.port ?? 465,
        secure: cfg.secure !== false,
        user: cfg.user,
        pass: cfg.pass,
      };
      id = await sendSmtp(smtpCfg, opts);
    }
    console.log(`✓ Sent to ${to} (id: ${id})`);
  } catch (e) {
    console.error(`✗ Failed: ${(e as Error).message}`);
    process.exit(1);
  }
}

main();
