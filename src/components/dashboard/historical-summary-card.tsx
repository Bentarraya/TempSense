import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HistoricalData {
  tempHigh: number;
  tempLow: number;
  humidityHigh: number;
  humidityLow: number;
}

interface HistoricalSummaryCardProps {
  data: HistoricalData | null;
}

export function HistoricalSummaryCard({ data }: HistoricalSummaryCardProps) {
  return (
    <Card className="shadow-lg col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Summary</CardTitle>
        <History className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {data ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Temperature High:</span>
              <span className="font-semibold">{data.tempHigh.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Temperature Low:</span>
              <span className="font-semibold">{data.tempLow.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Humidity High:</span>
              <span className="font-semibold">{data.humidityHigh.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Humidity Low:</span>
              <span className="font-semibold">{data.humidityLow.toFixed(1)}%</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading historical data...</p>
        )}
      </CardContent>
    </Card>
  );
}
