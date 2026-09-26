import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendEmail, SHOP_OWNER_EMAIL } from '@/lib/email';

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

async function submitContact(payload: ContactPayload): Promise<{ ok: true }> {
  const { error } = await supabase.from('a_simple_landing_pag_contact_messages').insert({
    name: payload.name,
    email: payload.email,
    message: payload.message,
  });
  if (error) throw error;

  try {
    await sendEmail({
      to: SHOP_OWNER_EMAIL,
      subject: `New inquiry from ${payload.name} — Fernwood Coffee`,
      html: `<p><strong>Name:</strong> ${payload.name}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Message:</strong></p><p>${payload.message.replace(/\n/g, '<br/>')}</p>`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nMessage: ${payload.message}`,
    });
  } catch (e) {
    // The message is already persisted; surface the email issue but don't block success.
    console.warn('Email notification failed:', (e as Error).message);
  }

  return { ok: true };
}

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    mutation.mutate({ name, email, message });
  };

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Get in touch</CardTitle>
          <CardDescription>
            Questions, catering requests, or just want to say hi — drop us a note and
            we'll get back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-small text-muted-foreground">Name</label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-small text-muted-foreground">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-small text-muted-foreground">Message</label>
              <textarea
                id="message"
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-y"
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't send your message</AlertTitle>
                <AlertDescription>{(mutation.error as Error).message}</AlertDescription>
              </Alert>
            )}

            {submitted && !mutation.isPending && (
              <Alert variant="success">
                <AlertTitle className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Message sent
                </AlertTitle>
                <AlertDescription>Thanks for reaching out — we'll reply soon.</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
              <Send size={16} />
              {mutation.isPending ? 'Sending...' : 'Send message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
