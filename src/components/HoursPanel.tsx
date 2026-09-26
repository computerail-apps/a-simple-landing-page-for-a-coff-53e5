import { useAppData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/lib/ui/Card';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { Button } from '@/lib/ui/Button';
import { cn } from '@/lib/cn';
import { Clock } from 'lucide-react';

interface OpeningHour {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MOCK_HOURS: OpeningHour[] = [
  { id: '0', day_of_week: 0, open_time: '8:00 AM', close_time: '3:00 PM', is_closed: false },
  { id: '1', day_of_week: 1, open_time: '7:00 AM', close_time: '6:00 PM', is_closed: false },
  { id: '2', day_of_week: 2, open_time: '7:00 AM', close_time: '6:00 PM', is_closed: false },
  { id: '3', day_of_week: 3, open_time: '7:00 AM', close_time: '6:00 PM', is_closed: false },
  { id: '4', day_of_week: 4, open_time: '7:00 AM', close_time: '7:00 PM', is_closed: false },
  { id: '5', day_of_week: 5, open_time: '7:00 AM', close_time: '7:00 PM', is_closed: false },
  { id: '6', day_of_week: 6, open_time: '8:00 AM', close_time: '5:00 PM', is_closed: false },
];

async function fetchLive(): Promise<OpeningHour[]> {
  throw new Error('not wired yet');
}

export function HoursPanel() {
  const { data, isLoading, error, refetch } = useAppData<OpeningHour[]>({
    key: ['opening_hours'],
    mock: MOCK_HOURS,
    fetchLive,
  });

  const today = new Date().getDay();
  const sorted = [...(data ?? [])].sort((a, b) => a.day_of_week - b.day_of_week);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={18} />
          Opening Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CenteredSpinner label="Loading hours" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load hours</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </AlertDescription>
          </Alert>
        ) : sorted.length === 0 ? (
          <EmptyState icon={<Clock size={20} />} title="Hours not set" description="We'll post our hours here soon." />
        ) : (
          <ul className="divide-y divide-border">
            {sorted.map((h) => {
              const isToday = h.day_of_week === today;
              return (
                <li
                  key={h.id}
                  className={cn(
                    'flex items-center justify-between gap-4 py-2.5 px-2 -mx-2 rounded-md text-small',
                    isToday && 'bg-primary/10 border border-primary/30'
                  )}
                >
                  <span className={cn('text-muted-foreground', isToday && 'font-medium text-foreground')}>
                    {DAY_NAMES[h.day_of_week]}
                    {isToday && <span className="ml-2 text-micro text-primary">Today</span>}
                  </span>
                  <span className={cn('tabular-nums text-muted-foreground', isToday && 'font-medium text-foreground')}>
                    {h.is_closed ? 'Closed' : `${h.open_time} – ${h.close_time}`}
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
