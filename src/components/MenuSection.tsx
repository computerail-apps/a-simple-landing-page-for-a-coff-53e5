import { useMemo } from 'react';
import { useAppData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { Button } from '@/lib/ui/Button';
import { Soup } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_available: boolean;
}

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Drip Coffee', description: 'Our house blend, brewed fresh all day.', price: 3.25, category: 'Coffee', is_available: true },
  { id: '2', name: 'Cappuccino', description: 'Double shot, steamed milk, deep foam.', price: 4.5, category: 'Coffee', is_available: true },
  { id: '3', name: 'Flat White', description: 'Ristretto pulls with velvety microfoam.', price: 4.75, category: 'Coffee', is_available: true },
  { id: '4', name: 'Cold Brew', description: 'Steeped 18 hours, served over ice.', price: 4.25, category: 'Coffee', is_available: true },
  { id: '5', name: 'Mocha', description: 'Dark chocolate, espresso, steamed milk.', price: 5.0, category: 'Coffee', is_available: true },
  { id: '6', name: 'Chai Latte', description: 'House-spiced chai, steamed milk.', price: 4.5, category: 'Tea', is_available: true },
  { id: '7', name: 'Matcha Latte', description: 'Ceremonial grade matcha, oat milk optional.', price: 5.25, category: 'Tea', is_available: true },
  { id: '8', name: 'English Breakfast', description: 'Loose leaf, steeped to order.', price: 3.0, category: 'Tea', is_available: true },
  { id: '9', name: 'Butter Croissant', description: 'Baked fresh each morning.', price: 3.75, category: 'Pastries', is_available: true },
  { id: '10', name: 'Almond Croissant', description: 'Filled with almond cream, toasted almonds.', price: 4.5, category: 'Pastries', is_available: true },
  { id: '11', name: 'Blueberry Muffin', description: 'Studded with wild blueberries.', price: 3.5, category: 'Pastries', is_available: true },
  { id: '12', name: 'Cinnamon Roll', description: 'Brown butter icing, warmed on request.', price: 4.25, category: 'Pastries', is_available: false },
  { id: '13', name: 'Avocado Toast', description: 'Sourdough, chili flake, lemon.', price: 8.5, category: 'Breakfast', is_available: true },
  { id: '14', name: 'Breakfast Sandwich', description: 'Egg, cheddar, aioli on a brioche bun.', price: 7.75, category: 'Breakfast', is_available: true },
  { id: '15', name: 'Overnight Oats', description: 'Steel-cut oats, seasonal fruit, honey.', price: 6.5, category: 'Breakfast', is_available: true },
];

async function fetchLive(): Promise<MenuItem[]> {
  throw new Error('not wired yet');
}

export function MenuSection() {
  const { data, isLoading, error, refetch } = useAppData<MenuItem[]>({
    key: ['menu_items'],
    mock: MOCK_MENU,
    fetchLive,
  });

  const grouped = useMemo(() => {
    const items = data ?? [];
    const map = new Map<string, MenuItem[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-h1 text-foreground">Menu</h2>
        <p className="text-body text-muted-foreground">Made fresh, priced fair.</p>
      </div>

      {isLoading ? (
        <CenteredSpinner label="Loading menu" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load the menu</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{(error as Error).message}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
          </AlertDescription>
        </Alert>
      ) : grouped.length === 0 ? (
        <EmptyState icon={<Soup size={20} />} title="Menu coming soon" description="Check back shortly, we're updating our offerings." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {grouped.map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-body font-medium text-foreground">{item.name}</span>
                        {!item.is_available && <Badge variant="outline">Sold out</Badge>}
                      </div>
                      {item.description && (
                        <p className="text-small text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-body tabular-nums text-foreground">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
