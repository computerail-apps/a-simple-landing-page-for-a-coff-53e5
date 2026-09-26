import { Container } from '@/lib/ui/Container';
import { Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-3 text-small text-muted-foreground sm:flex-row">
          <span className="inline-flex items-center gap-2">
            <Coffee size={14} />
            Fernwood Coffee
          </span>
          <span>© {new Date().getFullYear()} Fernwood Coffee. All rights reserved.</span>
        </div>
      </Container>
    </footer>
  );
}
