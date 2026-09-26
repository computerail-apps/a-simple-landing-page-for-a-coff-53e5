import { Nav, NavLink } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { Coffee, MapPin } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { MenuSection } from '@/components/MenuSection';
import { HoursPanel } from '@/components/HoursPanel';
import { AboutSection } from '@/components/AboutSection';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav
        brand={
          <span className="inline-flex items-center gap-2">
            <Coffee size={20} />
            Fernwood Coffee
          </span>
        }
        actions={
          <Button size="sm" onClick={() => scrollTo('contact')}>
            <MapPin size={16} />
            Visit us
          </Button>
        }
      >
        <NavLink href="#menu" onClick={(e) => { e.preventDefault(); scrollTo('menu'); }}>Menu</NavLink>
        <NavLink href="#hours" onClick={(e) => { e.preventDefault(); scrollTo('hours'); }}>Hours</NavLink>
        <NavLink href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</NavLink>
        <NavLink href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</NavLink>
      </Nav>
      <main>
        <Hero />
        <section id="menu" className="py-12 md:py-16">
          <Container>
            <MenuSection />
          </Container>
        </section>
        <section id="hours" className="py-12 md:py-16 border-t border-border">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <AboutSection />
              </div>
              <div className="md:col-span-5">
                <HoursPanel />
              </div>
            </div>
          </Container>
        </section>
        <section id="contact" className="py-12 md:py-16 border-t border-border">
          <Container>
            <ContactForm />
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
