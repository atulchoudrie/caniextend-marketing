import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 422 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (resendKey && audienceId) {
    try {
      const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend error:", res.status, detail);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
    }
  } else {
    // Dev/staging: log only
    console.log(`[waitlist] ${email}`);
  }

  return NextResponse.json({ ok: true });
}
