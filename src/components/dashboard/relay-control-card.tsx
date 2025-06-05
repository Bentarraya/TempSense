
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Zap, Lightbulb } from 'lucide-react';

interface RelayControlCardProps {
  relay1Name?: string;
  relay1Status: 'ON' | 'OFF' | null;
  onRelay1Toggle: (newState: 'ON' | 'OFF') => void;
  relay2Name?: string;
  relay2Status: 'ON' | 'OFF' | null;
  onRelay2Toggle: (newState: 'ON' | 'OFF') => void;
  isLoading: boolean;
  isInitiallyConnecting: boolean; // New prop
}

export function RelayControlCard({
  relay1Name = "Relay 1 (Light)",
  relay1Status,
  onRelay1Toggle,
  relay2Name = "Relay 2 (Light)",
  relay2Status,
  onRelay2Toggle,
  isLoading,
  isInitiallyConnecting
}: RelayControlCardProps) {

  const showCompactLoadingMessage = isInitiallyConnecting && isLoading && relay1Status === null && relay2Status === null;

  return (
    <Card className="shadow-lg md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Relay Controls</CardTitle>
        <Zap className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {showCompactLoadingMessage ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading relay states...</p>
        ) : (
          <>
            {/* Relay 1 Control */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors">
              <div className="flex items-center space-x-3">
                <Lightbulb className={`h-6 w-6 ${relay1Status === 'ON' ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                <Label htmlFor="relay1-switch" className="text-base font-medium cursor-pointer">
                  {relay1Name}
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                 <span className={`text-sm font-semibold w-8 text-right ${relay1Status === 'ON' ? 'text-green-500' : (relay1Status === 'OFF' ? 'text-red-500' : 'text-muted-foreground')}`}>
                    {relay1Status ?? 'N/A'}
                 </span>
                <Switch
                  id="relay1-switch"
                  checked={relay1Status === 'ON'}
                  onCheckedChange={(checked) => onRelay1Toggle(checked ? 'ON' : 'OFF')}
                  disabled={isLoading} // Disabled if any data fetch is in progress
                  aria-label={`Toggle ${relay1Name}`}
                />
              </div>
            </div>

            {/* Relay 2 Control */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg border bg-card-foreground/5 hover:bg-card-foreground/10 transition-colors">
              <div className="flex items-center space-x-3">
                <Lightbulb className={`h-6 w-6 ${relay2Status === 'ON' ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                <Label htmlFor="relay2-switch" className="text-base font-medium cursor-pointer">
                  {relay2Name}
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-semibold w-8 text-right ${relay2Status === 'ON' ? 'text-green-500' : (relay2Status === 'OFF' ? 'text-red-500' : 'text-muted-foreground')}`}>
                    {relay2Status ?? 'N/A'}
                 </span>
                <Switch
                  id="relay2-switch"
                  checked={relay2Status === 'ON'}
                  onCheckedChange={(checked) => onRelay2Toggle(checked ? 'ON' : 'OFF')}
                  disabled={isLoading} // Disabled if any data fetch is in progress
                  aria-label={`Toggle ${relay2Name}`}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
