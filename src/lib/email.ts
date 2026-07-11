import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";

const DATA_DIR = path.join(process.cwd(), "data");
const OUTBOX = path.join(DATA_DIR, "outbox.json");

export type EmailTemplate =
  | "abandon"
  | "restock"
  | "order"
  | "newsletter"
  | "subscribe"
  | "brand_invite"
  | "brand_receipt"
  | "domain_verify"
  | "generic";

export interface OutboundEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  template: EmailTemplate;
  meta?: Record<string, unknown>;
  status: "queued" | "sent" | "logged" | "failed";
  provider?: string;
  error?: string;
  createdAt: string;
}

interface OutboxFile {
  emails: OutboundEmail[];
}

async function ensureOutbox(): Promise<OutboxFile> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(OUTBOX, "utf8");
    return JSON.parse(raw) as OutboxFile;
  } catch {
    const empty: OutboxFile = { emails: [] };
    await fs.writeFile(OUTBOX, JSON.stringify(empty, null, 2));
    return empty;
  }
}

async function appendOutbox(email: OutboundEmail) {
  const box = await ensureOutbox();
  box.emails.unshift(email);
  box.emails = box.emails.slice(0, 200);
  await fs.writeFile(OUTBOX, JSON.stringify(box, null, 2));
}

function wrapHtml(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="margin:0;font-family:Georgia,serif;background:#faf7f2;color:#1a1612">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="letter-spacing:0.28em;font-size:11px;text-transform:uppercase;color:#c4a574">LUMÉA</p>
    <h1 style="font-weight:400;font-size:28px;margin:12px 0 16px">${title}</h1>
    <div style="font-size:15px;line-height:1.6;color:#3d3832">${body}</div>
    <p style="margin-top:32px;font-size:11px;color:#8a847c;letter-spacing:0.08em">Beauty without boundaries.</p>
  </div></body></html>`;
}

export function templates() {
  return {
    abandon(opts: {
      recoverUrl: string;
      itemCount: number;
      cartValue: number;
      code?: string;
    }) {
      const code = opts.code || "WELCOME10";
      return {
        subject: `Your LUMÉA bag is waiting · ${opts.itemCount} item${opts.itemCount === 1 ? "" : "s"}`,
        html: wrapHtml(
          "Still thinking it over?",
          `<p>You left ${opts.itemCount} piece${opts.itemCount === 1 ? "" : "s"} (about $${opts.cartValue.toFixed(2)}) in your bag.</p>
           <p>Come back and checkout with <strong>${code}</strong> for $10 off your first order.</p>
           <p style="margin:24px 0"><a href="${opts.recoverUrl}" style="background:#1a1612;color:#faf7f2;padding:12px 20px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase">Restore my bag</a></p>
           <p style="font-size:13px;color:#8a847c">Link expires in 7 days. Free shipping from $75.</p>`
        ),
        text: `Your bag has ${opts.itemCount} items (~$${opts.cartValue.toFixed(2)}). Restore: ${opts.recoverUrl} · Code ${code}`,
      };
    },
    restock(opts: { productName: string; productUrl: string }) {
      return {
        subject: `Back in stock: ${opts.productName}`,
        html: wrapHtml(
          "It's back",
          `<p><strong>${opts.productName}</strong> just restocked.</p>
           <p><a href="${opts.productUrl}" style="color:#c4a574">Shop now before it sells out →</a></p>`
        ),
        text: `${opts.productName} is back. ${opts.productUrl}`,
      };
    },
    order(opts: {
      orderNumber: string;
      total: number;
      email: string;
    }) {
      return {
        subject: `Order confirmed · ${opts.orderNumber}`,
        html: wrapHtml(
          "You're glowing",
          `<p>Thanks for your order <strong>${opts.orderNumber}</strong>.</p>
           <p>Total paid: <strong>$${opts.total.toFixed(2)}</strong></p>
           <p>We'll email tracking when it ships. Receipt sent to ${opts.email}.</p>`
        ),
        text: `Order ${opts.orderNumber} confirmed · $${opts.total.toFixed(2)}`,
      };
    },
    newsletter() {
      return {
        subject: "Welcome to the LUMÉA house",
        html: wrapHtml(
          "You're on the list",
          `<p>First access to drops, shade launches, and Glow Club perks.</p>
           <p>Start with the <a href="/quiz" style="color:#c4a574">match quiz</a> or open <a href="/studio" style="color:#c4a574">Mirror Studio</a>.</p>`
        ),
        text: "Welcome to LUMÉA — take the match quiz and try Mirror Studio.",
      };
    },
    subscribe(opts: { productName: string; intervalDays: number }) {
      return {
        subject: `Subscribe & save · ${opts.productName}`,
        html: wrapHtml(
          "Never run out",
          `<p>We'll replenish <strong>${opts.productName}</strong> every ${opts.intervalDays} days at 15% off.</p>
           <p>Pause anytime from your account. Stripe billing connects in production.</p>`
        ),
        text: `Subscribed to ${opts.productName} every ${opts.intervalDays} days.`,
      };
    },
    brandInvite(opts: {
      brandName: string;
      email: string;
      tempPassword: string;
      role: string;
      loginUrl: string;
    }) {
      return {
        subject: `You're invited to ${opts.brandName} on LUMÉA`,
        html: wrapHtml(
          "Team seat ready",
          `<p>You've been invited to <strong>${opts.brandName}</strong> as <strong>${opts.role}</strong>.</p>
           <p>Login: ${opts.email}<br/>Temp password: <code>${opts.tempPassword}</code></p>
           <p><a href="${opts.loginUrl}" style="background:#1a1612;color:#faf7f2;padding:12px 20px;text-decoration:none;font-size:12px;letter-spacing:0.12em;text-transform:uppercase">Open brand portal</a></p>`
        ),
        text: `Invited to ${opts.brandName} as ${opts.role}. Login ${opts.email} / ${opts.tempPassword} → ${opts.loginUrl}`,
      };
    },
    brandReceipt(opts: {
      brandName: string;
      plan: string;
      amount: number;
      interval: string;
      invoiceNumber: string;
    }) {
      return {
        subject: `LUMÉA SaaS receipt · ${opts.invoiceNumber}`,
        html: wrapHtml(
          "Payment received",
          `<p><strong>${opts.brandName}</strong> is now on the <strong>${opts.plan}</strong> plan (${opts.interval}).</p>
           <p>Amount: <strong>$${opts.amount.toFixed(2)}</strong></p>
           <p>Invoice: ${opts.invoiceNumber}</p>
           <p style="font-size:13px;color:#8a847c">Demo charge — connect Stripe for live billing.</p>`
        ),
        text: `Paid $${opts.amount} for ${opts.plan} (${opts.interval}) · ${opts.invoiceNumber}`,
      };
    },
    domainVerify(opts: { domain: string; brandName: string }) {
      return {
        subject: `Domain verified · ${opts.domain}`,
        html: wrapHtml(
          "Custom domain live",
          `<p><strong>${opts.domain}</strong> is verified for ${opts.brandName}.</p>
           <p>Customers hitting that host resolve to your white-label storefront.</p>`
        ),
        text: `${opts.domain} verified for ${opts.brandName}.`,
      };
    },
  };
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
  template: EmailTemplate;
  meta?: Record<string, unknown>;
  baseUrl?: string;
}): Promise<OutboundEmail> {
  const email: OutboundEmail = {
    id: nanoid(12),
    to: input.to.trim().toLowerCase(),
    subject: input.subject,
    html: input.html,
    text: input.text,
    template: input.template,
    meta: input.meta,
    status: "logged",
    createdAt: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "LUMÉA <onboarding@resend.dev>";

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [email.to],
          subject: email.subject,
          html: email.html,
          text: email.text,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        email.status = "failed";
        email.error = err.slice(0, 400);
        email.provider = "resend";
      } else {
        email.status = "sent";
        email.provider = "resend";
      }
    } catch (e) {
      email.status = "failed";
      email.error = e instanceof Error ? e.message : "send failed";
      email.provider = "resend";
    }
  }

  await appendOutbox(email);
  return email;
}

export async function listOutbox(limit = 50) {
  const box = await ensureOutbox();
  return box.emails.slice(0, limit);
}

export function appBaseUrl(reqUrl?: string) {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  if (reqUrl) {
    try {
      const u = new URL(reqUrl);
      return `${u.protocol}//${u.host}`;
    } catch {
      /* fallthrough */
    }
  }
  return "http://localhost:3006";
}
