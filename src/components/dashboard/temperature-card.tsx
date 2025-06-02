import { Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TemperatureCardProps {
  temperature: number | null;
}

export function TemperatureCard({ temperature }: TemperatureCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Temperature</CardTitle>
        <Thermometer className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-primary transition-all duration-500">
          {temperature !== null ? `${temperature.toFixed(1)}°C` : 'Loading...'}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Current ambient temperature
        </p>
      </CardContent>
    </Card>
  );
}
