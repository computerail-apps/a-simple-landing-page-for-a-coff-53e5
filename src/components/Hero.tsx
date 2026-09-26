import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { Coffee, ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,theme(colors.primary.DEFAULT/0.08),transparent_60%)]" />
      <Container>
        <div className="relative flex flex-col items-start gap-6 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1 text-small text-muted-foreground">
            <Coffee size={14} />
            Neighborhood roastery &amp; cafe
          </div>
          <h1 className="text-display max-w-2xl text-foreground">
            Fernwood Coffee
          </h1>
          <p className="max-w-xl text-body text-muted-foreground">
            Slow-roasted beans, warm light, and a corner table that's always yours.
            We've been pouring coffee for the neighborhood since sunrise every day —
            come sit with us.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
              <ArrowDown size={16} />
              See the menu
            </Button>
            <Button variant="secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Get in touch
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
