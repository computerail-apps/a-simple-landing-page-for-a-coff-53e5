import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { Coffee, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  is_available: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export function MenuSection() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['menu_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('a_simple_landing_pag_menu_items')
        .select('id,name,description,price,category,is_available')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as MenuItem[];
    },
  });

  const available = (data ?? []).filter((i) => i.is_available);
  const grouped = available.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});
  const categories = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-h1">Menu</h2>
        <p className="text-body text-muted-foreground">
          Fresh, small-batch, made to order — here's what we're pouring and baking today.
        </p>
      </div>

      {isLoading ? (
        <CenteredSpinner label="Loading menu" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load the menu</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{(error as Error).message}</p>
            <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={14} />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Coffee size={20} />}
          title="Menu coming soon"
          description="We're setting up our menu. Check back shortly."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {grouped[category].map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-body font-medium text-foreground">{item.name}</div>
                      {item.description && (
                        <p className="text-small text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="tabular-nums whitespace-nowrap">
                      {formatPrice(item.price)}
                    </Badge>
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
