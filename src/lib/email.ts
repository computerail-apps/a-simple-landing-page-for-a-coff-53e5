const EMAILS_ENDPOINT = 'https://computerail.co/api/vibe-coding/emails/send';
const APP_ID = 'e173503b-8d14-4134-b7dd-a1defd237720';

// The address that receives inquiry notifications for the shop.
export const SHOP_OWNER_EMAIL = 'hello@fernwoodcoffee.com';

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<void> {
  const res = await fetch(EMAILS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appId: APP_ID, to, subject, html, text }),
  });

  if (!res.ok) {
    if (res.status === 503) {
      throw new Error('Email sending is not configured for this app yet.');
    }
    let msg = `Failed to send email (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(msg);
  }
}
