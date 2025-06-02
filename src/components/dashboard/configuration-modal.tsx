
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ConfigurationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ConfigurationModal({ isOpen, onOpenChange }: ConfigurationModalProps) {
  const { toast } = useToast();
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // Placeholder for actual configuration logic
    console.log("Configuration Submitted:", { ssid, password });
    toast({
      title: "Configuration Saved (Mock)",
      description: "ESP32 connection settings have been updated (simulated).",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ESP32 Configuration</DialogTitle>
          <DialogDescription>
            Enter your WiFi credentials for the ESP32 to connect and send data.
            This is a placeholder and does not actually configure an ESP32.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2 items-start sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="ssid" className="text-left sm:text-right col-span-1">
              WiFi SSID
            </Label>
            <Input
              id="ssid"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="col-span-1 sm:col-span-3"
              placeholder="Your WiFi Name"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 items-start sm:grid-cols-4 sm:items-center sm:gap-4">
            <Label htmlFor="password" className="text-left sm:text-right col-span-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-1 sm:col-span-3"
              placeholder="Your WiFi Password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
