
"use client";

import { useState, useEffect } from 'react';
import { Settings, ThermometerIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemperatureCard } from '@/components/dashboard/temperature-card';
import { HumidityCard } from '@/components/dashboard/humidity-card';
import { HistoricalSummaryCard } from '@/components/dashboard/historical-summary-card';
import { ConfigurationModal } from '@/components/dashboard/configuration-modal';
import { useToast } from "@/hooks/use-toast";

interface HistoricalData {
  tempHigh: number;
  tempLow: number;
  humidityHigh: number;
  humidityLow: number;
}

export default function TempSenseDashboard() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null); // Data historis masih placeholder
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Inisialisasi data historis (masih placeholder, bisa dikembangkan lebih lanjut)
    setHistoricalData({
      tempHigh: 26.5,
      tempLow: 18.2,
      humidityHigh: 58.0,
      humidityLow: 35.5,
    });

    const fetchSensorData = async () => {
      try {
        const response = await fetch('/api/sensor-data');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch sensor data');
        }
        const data = await response.json();
        if (data.temperature !== null && data.humidity !== null) {
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          if (data.timestamp) {
            setLastUpdated(new Date(data.timestamp));
          }
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Data",
          description: error instanceof Error ? error.message : "Could not connect to the sensor API.",
        });
      }
    };

    fetchSensorData(); // Panggil sekali saat komponen dimuat
    const interval = setInterval(fetchSensorData, 5000); // Ambil data setiap 5 detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, [toast]);

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
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js and ShadCN UI. {temperature === null ? "Attempting to connect to sensor..." : "Sensor data is live."}
          </p>
        </div>
      </footer>
      
      <ConfigurationModal isOpen={isConfigModalOpen} onOpenChange={setIsConfigModalOpen} />
    </div>
  );
}
