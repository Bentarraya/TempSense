import { Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HumidityCardProps {
  humidity: number | null;
}

export function HumidityCard({ humidity }: HumidityCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Humidity</CardTitle>
        <Droplets className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary transition-all duration-500">
          {humidity !== null ? `${humidity.toFixed(1)}%` : 'Loading...'}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Current relative humidity
        </p>
      </CardContent>
    </Card>
  );
}
