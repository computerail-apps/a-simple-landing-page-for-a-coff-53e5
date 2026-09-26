import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/Card';
import { MapPin, Phone, Mail } from 'lucide-react';

export function AboutSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-h1 text-foreground">About Fernwood</h2>
        <p className="text-body text-muted-foreground">
          Fernwood Coffee opened its doors as a small corner roastery with one goal:
          serve honest, carefully sourced coffee in a room that feels like home. Every
          bean is roasted in small batches, every pastry is baked before sunrise, and
          every table is yours for as long as you need it.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Find us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-small text-muted-foreground">
            <MapPin size={16} className="shrink-0 text-foreground" />
            412 Fernwood Ave, Portland, OR 97214
          </div>
          <div className="flex items-center gap-3 text-small text-muted-foreground">
            <Phone size={16} className="shrink-0 text-foreground" />
            (503) 555-0148
          </div>
          <div className="flex items-center gap-3 text-small text-muted-foreground">
            <Mail size={16} className="shrink-0 text-foreground" />
            hello@fernwoodcoffee.com
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
