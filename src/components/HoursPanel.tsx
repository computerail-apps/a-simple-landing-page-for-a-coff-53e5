import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/cn';

interface OpeningHour {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(t: string | null): string {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

export function HoursPanel() {
  const today = new Date().getDay();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['opening_hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('a_simple_landing_pag_opening_hours')
        .select('id,day_of_week,open_time,close_time,is_closed')
        .order('day_of_week', { ascending: true });
      if (error) throw error;
      return (data ?? []) as OpeningHour[];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={18} />
          Opening hours
        </CardTitle>
        <CardDescription>Today highlighted below.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CenteredSpinner label="Loading hours" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load hours</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>{(error as Error).message}</p>
              <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw size={14} />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={<Clock size={20} />}
            title="Hours not set yet"
            description="Opening hours will appear here once configured."
          />
        ) : (
          <ul className="divide-y divide-border">
            {data.map((h) => {
              const isToday = h.day_of_week === today;
              return (
                <li
                  key={h.id}
                  className={cn(
                    'flex items-center justify-between gap-4 py-2.5 px-2 -mx-2 rounded-md',
                    isToday && 'bg-muted'
                  )}
                >
                  <span className={cn('text-body', isToday ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                    {DAY_NAMES[h.day_of_week]}
                    {isToday && (
                      <Badge variant="success" className="ml-2 align-middle">Today</Badge>
                    )}
                  </span>
                  <span className={cn('text-small tabular-nums', isToday ? 'text-foreground' : 'text-muted-foreground')}>
                    {h.is_closed ? 'Closed' : `${formatTime(h.open_time)} – ${formatTime(h.close_time)}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
