
"use client";

import { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { TemperatureCard } from '@/components/dashboard/temperature-card';
import { HumidityCard } from '@/components/dashboard/humidity-card';
import { RelayControlCard } from '@/components/dashboard/relay-control-card';
import { useToast } from "@/hooks/use-toast";


type RelayState = 'ON' | 'OFF' | null;

interface DeviceStatus {
  temperature: number | null;
  humidity: number | null;
  relay1ActualState: RelayState;
  relay2ActualState: RelayState;
  timestamp: string | null; 
}

export default function SmartControlDashboard() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [relay1ActualState, setRelay1ActualState] = useState<RelayState>(null);
  const [relay2ActualState, setRelay2ActualState] = useState<RelayState>(null);
  const [isLoadingDeviceStatus, setIsLoadingDeviceStatus] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchDeviceStatus = async () => {
      setIsLoadingDeviceStatus(true);
      try {
        const response = await fetch('/api/sensor-data');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch device status');
        }
        const data: DeviceStatus = await response.json();
        if (data.timestamp) {
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          setRelay1ActualState(data.relay1ActualState);
          setRelay2ActualState(data.relay2ActualState);
          setLastUpdated(new Date(data.timestamp));
        } else {
           setRelay1ActualState(data.relay1ActualState); 
           setRelay2ActualState(data.relay2ActualState);
           if (data.temperature !== undefined) setTemperature(data.temperature);
           if (data.humidity !== undefined) setHumidity(data.humidity);
        }
      } catch (error) {
        console.error("Error fetching device status:", error);
        // Only show toast if it's not the initial load or if there was a previous successful load
        if (lastUpdated) { 
            toast({
            variant: "destructive",
            title: "Error Fetching Device Status",
            description: error instanceof Error ? error.message : "Could not connect to the device API.",
            });
        } else if (!lastUpdated && !isLoadingDeviceStatus) { // If initial load fails after trying
           toast({
            variant: "destructive",
            title: "Error Connecting to Device",
            description: "Could not fetch initial device status. Please check ESP32 connection.",
            });
        }
      } finally {
        setIsLoadingDeviceStatus(false);
      }
    };
    
    const fetchAllData = () => {
        fetchDeviceStatus();
    };

    fetchAllData(); 
    const interval = setInterval(fetchAllData, 5000); 

    return () => clearInterval(interval);
  }, [toast, lastUpdated, isLoadingDeviceStatus]); 

  const handleRelayToggle = async (relayId: 'relay1' | 'relay2', newState: 'ON' | 'OFF') => {
    try {
      const response = await fetch('/api/relay-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ relayId, command: newState }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send relay command');
      }

      toast({
        title: "Command Sent",
        description: `${relayId === 'relay1' ? 'Relay 1 (Light)' : 'Relay 2 (Light)'} command to turn ${newState} sent. ESP32 will update shortly.`,
      });
      
      // Optimistically update local state for desired state if needed,
      // but actual state will come from fetchDeviceStatus
      // For now, we rely on the next fetchDeviceStatus to update the actual state

    } catch (error) {
      console.error(`Error toggling ${relayId}:`, error);
      toast({
        variant: "destructive",
        title: `Error Sending ${relayId === 'relay1' ? 'Relay 1' : 'Relay 2'} Command`,
        description: error instanceof Error ? error.message : "Could not send command.",
      });
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary text-primary-foreground">
              <Cpu size={24} />
            </div>
            <h1 className="text-2xl font-bold font-headline">SmartControl</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 px-4 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TemperatureCard temperature={temperature} />
          <HumidityCard humidity={humidity} />
          
          <RelayControlCard
            relay1Status={relay1ActualState}
            onRelay1Toggle={(newState) => handleRelayToggle('relay1', newState)}
            relay2Status={relay2ActualState}
            onRelay2Toggle={(newState) => handleRelayToggle('relay2', newState)}
            isLoading={isLoadingDeviceStatus}
            isInitiallyConnecting={!lastUpdated && isLoadingDeviceStatus}
          />
        </div>
        
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Device status last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
         {isLoadingDeviceStatus && !lastUpdated && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
                Connecting to device...
            </p>
        )}
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-20 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js and ShadCN UI. {temperature === null && humidity === null && relay1ActualState === null && relay2ActualState === null && !lastUpdated && isLoadingDeviceStatus ? "Attempting to connect to device..." : "Device data is live."}
          </p>
        </div>
      </footer>
    </div>
  );
}
