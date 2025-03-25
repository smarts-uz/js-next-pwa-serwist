'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Bluetooth, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

// Web Bluetooth API type definitions
interface BluetoothDevice {
  name: string;
  id: string;
  connected: boolean;
}

declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: {
        acceptAllDevices?: boolean;
        optionalServices?: string[];
        filters?: Array<{ services: string[] }>;
      }): Promise<{
        name?: string;
        id: string;
        gatt?: {
          connect(): Promise<{
            getPrimaryService(service: string): Promise<{
              getCharacteristic(characteristic: string): Promise<any>;
            }>;
          }>;
        };
      }>;
    };
  }
}

export default function WebBluetoothPage() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const scanDevices = async () => {
    try {
      setIsScanning(true);
      setError('');
      
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API is not supported in your browser');
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });

      const newDevice: BluetoothDevice = {
        name: device.name || 'Unknown Device',
        id: device.id,
        connected: false
      };

      setDevices(prev => [...prev, newDevice]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan for devices');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      setIsConnecting(deviceId);
      setError('');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }]
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService('battery_service');
      const characteristic = await service?.getCharacteristic('battery_level');

      setDevices(prev =>
        prev.map(d =>
          d.id === deviceId ? { ...d, connected: true } : d
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to device');
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Web Bluetooth</h1>
        <p className="text-muted-foreground">
          Connect and interact with Bluetooth Low Energy devices directly from your web browser
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Scanner</CardTitle>
          <CardDescription>
            Scan for nearby Bluetooth devices and connect to them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={scanDevices}
            disabled={isScanning}
            className="w-full"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning for devices...
              </>
            ) : (
              <>
                <Bluetooth className="mr-2 h-4 w-4" />
                Scan for Devices
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {device.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => connectToDevice(device.id)}
                      disabled={device.connected || isConnecting === device.id}
                    >
                      {isConnecting === device.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {devices.length === 0 && !isScanning && (
              <div className="text-center py-8 text-muted-foreground">
                No devices found. Click "Scan for Devices" to start scanning.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Use Cases</CardTitle>
          <CardDescription>
            Common applications of Web Bluetooth API
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">Health & Fitness</h3>
            <p className="text-sm text-muted-foreground">
              Connect to heart rate monitors, fitness trackers, and other health devices
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Smart Home</h3>
            <p className="text-sm text-muted-foreground">
              Control smart bulbs, thermostats, and other IoT devices
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Industrial</h3>
            <p className="text-sm text-muted-foreground">
              Monitor sensors, control machinery, and collect data from industrial devices
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Gaming</h3>
            <p className="text-sm text-muted-foreground">
              Connect to game controllers and other gaming peripherals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 