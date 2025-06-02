
"use client";

import { useState, useEffect } from 'react';
import { Settings, ThermometerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemperatureCard } from '@/components/dashboard/temperature-card';
import { HumidityCard } from '@/components/dashboard/humidity-card';
import { HistoricalSummaryCard } from '@/components/dashboard/historical-summary-card';
import { ConfigurationModal } from '@/components/dashboard/configuration-modal';

interface HistoricalData {
  tempHigh: number;
  tempLow: number;
  humidityHigh: number;
  humidityLow: number;
}

export default function TempSenseDashboard() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    // Simulate initial data load
    setTemperature(20 + Math.random() * 5); // Initial temp between 20-25°C
    setHumidity(40 + Math.random() * 10);   // Initial humidity between 40-50%
    setHistoricalData({
      tempHigh: 26.5 + Math.random() * 2,
      tempLow: 18.2 - Math.random() * 2,
      humidityHigh: 58.0 + Math.random() * 5,
      humidityLow: 35.5 - Math.random() * 5,
    });

    const interval = setInterval(() => {
      setTemperature(prevTemp => {
        if (prevTemp === null) return 22.5 + (Math.random() - 0.5) * 2; // Center around 22.5°C
        const change = (Math.random() - 0.5) * 0.5; // Small change
        let newTemp = prevTemp + change;
        if (newTemp < 15) newTemp = 15; // Min temp
        if (newTemp > 35) newTemp = 35; // Max temp
        return newTemp;
      });
      setHumidity(prevHumidity => {
        if (prevHumidity === null) return 45 + (Math.random() - 0.5) * 10; // Center around 45%
        const change = (Math.random() - 0.5) * 2; // Small change
        let newHumidity = prevHumidity + change;
        if (newHumidity < 30) newHumidity = 30; // Min humidity
        if (newHumidity > 70) newHumidity = 70; // Max humidity
        return newHumidity;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary text-primary-foreground">
              <ThermometerIcon size={24} />
            </div>
            <h1 className="text-2xl font-bold font-headline">TempSense</h1>
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsConfigModalOpen(true)} aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TemperatureCard temperature={temperature} />
          <HumidityCard humidity={humidity} />
          <HistoricalSummaryCard data={historicalData} />
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js and ShadCN UI. Data is simulated.
          </p>
        </div>
      </footer>
      
      <ConfigurationModal isOpen={isConfigModalOpen} onOpenChange={setIsConfigModalOpen} />
    </div>
  );
}
