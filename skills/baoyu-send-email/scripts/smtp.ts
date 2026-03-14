import * as net from "net";
import * as tls from "tls";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

function base64(s: string): string {
  return Buffer.from(s, "utf-8").toString("base64");
}

class SmtpClient {
  private socket: net.Socket | tls.TLSSocket | null = null;
  private buf = "";

  private async readLine(): Promise<string> {
    return new Promise((resolve) => {
      const check = () => {
        const idx = this.buf.indexOf("\r\n");
        if (idx !== -1) {
          const line = this.buf.slice(0, idx);
          this.buf = this.buf.slice(idx + 2);
          resolve(line);
        } else {
          this.socket!.once("data", (chunk: Buffer) => {
            this.buf += chunk.toString("utf-8");
            check();
          });
        }
      };
      check();
    });
  }

  private async readResponse(): Promise<string> {
    let last = "";
    while (true) {
      last = await this.readLine();
      if (last[3] !== "-") break;
    }
    return last;
  }

  private sendLine(cmd: string): void {
    this.socket!.write(cmd + "\r\n");
  }

  async connect(config: SmtpConfig): Promise<void> {
    if (config.secure) {
      await new Promise<void>((resolve, reject) => {
        const s = tls.connect(
          { host: config.host, port: config.port },
          () => {
            this.socket = s;
            resolve();
          }
        );
        s.once("error", reject);
      });
    } else {
      await new Promise<void>((resolve, reject) => {
        const s = net.createConnection(config.port, config.host, () => {
          this.socket = s;
          resolve();
        });
        s.once("error", reject);
      });
    }

    await this.readResponse();
    this.sendLine(`EHLO localhost`);
    const ehlo = await this.readResponse();

    if (!config.secure && ehlo.includes("STARTTLS")) {
      this.sendLine("STARTTLS");
      await this.readResponse();
      await new Promise<void>((resolve, reject) => {
        const upgraded = tls.connect(
          { socket: this.socket as net.Socket, host: config.host },
          () => {
            this.socket = upgraded;
            resolve();
          }
        );
        upgraded.once("error", reject);
      });
      this.sendLine(`EHLO localhost`);
      await this.readResponse();
    }

    this.sendLine("AUTH LOGIN");
    await this.readResponse();
    this.sendLine(base64(config.user));
    await this.readResponse();
    this.sendLine(base64(config.pass));
    const authResult = await this.readResponse();
    if (!authResult.startsWith("2")) {
      throw new Error(`SMTP AUTH failed: ${authResult}`);
    }
  }

  async sendMail(opts: MailOptions): Promise<string> {
    const boundary = `boundary_${Date.now()}`;
    const msgId = `<${Date.now()}@baoyu-send-email>`;

    this.sendLine(`MAIL FROM:<${extractAddr(opts.from)}>`);
    await this.readResponse();
    this.sendLine(`RCPT TO:<${extractAddr(opts.to)}>`);
    await this.readResponse();
    this.sendLine("DATA");
    await this.readResponse();

    const payload = [
      `From: ${opts.from}`,
      `To: ${opts.to}`,
      `Subject: ${opts.subject}`,
      `Message-ID: ${msgId}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      opts.text,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      opts.html,
      ``,
      `--${boundary}--`,
    ].join("\r\n");

    this.socket!.write(payload + "\r\n.\r\n");
    const result = await this.readResponse();
    if (!result.startsWith("2")) {
      throw new Error(`SMTP DATA failed: ${result}`);
    }
    return msgId;
  }

  async quit(): Promise<void> {
    this.sendLine("QUIT");
    await this.readResponse();
    this.socket!.destroy();
  }
}

function extractAddr(addr: string): string {
  const m = addr.match(/<([^>]+)>/);
  return m ? m[1] : addr.trim();
}

export async function sendSmtp(
  config: SmtpConfig,
  opts: MailOptions
): Promise<string> {
  const client = new SmtpClient();
  await client.connect(config);
  const id = await client.sendMail(opts);
  await client.quit();
  return id;
}
