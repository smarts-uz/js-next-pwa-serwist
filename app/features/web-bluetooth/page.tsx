"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Bluetooth,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

// Web Bluetooth API type definitions
interface BluetoothDevice {
  name: string;
  id: string;
  connected: boolean;
  device?: any;
  services?: Array<{
    uuid: string;
    characteristics?: Array<{
      uuid: string;
      properties: string[];
      value?: string;
    }>;
  }>;
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

// Generic service UUIDs that most BLE devices support
const GENERIC_SERVICES = [
  "00001800-0000-1000-8000-00805f9b34fb", // Generic Access
  "00001801-0000-1000-8000-00805f9b34fb", // Generic Attribute
  "0000180a-0000-1000-8000-00805f9b34fb", // Device Information
];

// Standard characteristic UUIDs
const CHARACTERISTICS = {
  DEVICE_NAME: "00002a00-0000-1000-8000-00805f9b34fb",
  BATTERY_LEVEL: "00002a19-0000-1000-8000-00805f9b34fb",
};

export default function WebBluetoothPage() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(
    null
  );

  const scanDevices = async () => {
    try {
      setIsScanning(true);
      setError("");

      if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth API is not supported in your browser");
      }

      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: GENERIC_SERVICES,
      });

      const newDevice: BluetoothDevice = {
        name: device.name || "Unknown Device",
        id: device.id,
        connected: false,
        device: device,
      };

      setDevices((prev) => [...prev, newDevice]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to scan for devices"
      );
    } finally {
      setIsScanning(false);
    }
  };

  const readCharacteristic = async (
    service: any,
    characteristicUUID: string
  ) => {
    try {
      const characteristic = await service.getCharacteristic(
        characteristicUUID
      );
      const value = await characteristic.readValue();
      return new TextDecoder().decode(value);
    } catch (err) {
      console.log(`Failed to read characteristic ${characteristicUUID}:`, err);
      return null;
    }
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      setIsConnecting(deviceId);
      setError("");

      const deviceToConnect = devices.find((d) => d.id === deviceId);
      if (!deviceToConnect?.device) {
        throw new Error("Device not found");
      }

      const server = await deviceToConnect.device.gatt?.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server");
      }

      const services = [];
      // Try to connect to any available service
      for (const serviceUUID of GENERIC_SERVICES) {
        try {
          const service = await server.getPrimaryService(serviceUUID);
          console.log(`Connected to service: ${serviceUUID}`);

          // Get characteristics for this service
          const characteristics = [];
          try {
            // Try to read device name
            if (serviceUUID === GENERIC_SERVICES[0]) {
              // Generic Access service
              const deviceName = await readCharacteristic(
                service,
                CHARACTERISTICS.DEVICE_NAME
              );
              if (deviceName) {
                characteristics.push({
                  uuid: CHARACTERISTICS.DEVICE_NAME,
                  properties: ["read"],
                  value: deviceName,
                });
              }
            }
          } catch (err) {
            console.log("No characteristics found for service");
          }

          services.push({
            uuid: serviceUUID,
            characteristics,
          });
        } catch (err) {
          console.log(`Service ${serviceUUID} not available`);
          continue;
        }
      }

      if (services.length === 0) {
        throw new Error("No compatible services found on device");
      }

      // Update device connection status and services
      const updatedDevice = {
        ...deviceToConnect,
        connected: true,
        services,
      };

      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? updatedDevice : d))
      );
      setSelectedDevice(updatedDevice);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to device"
      );
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, connected: false } : d))
      );
      setSelectedDevice(null);
    } finally {
      setIsConnecting(null);
    }
  };

  const disconnectDevice = async (deviceId: string) => {
    try {
      const deviceToDisconnect = devices.find((d) => d.id === deviceId);
      if (deviceToDisconnect?.device?.gatt?.connected) {
        await deviceToDisconnect.device.gatt.disconnect();
        setDevices((prev) =>
          prev.map((d) => (d.id === deviceId ? { ...d, connected: false } : d))
        );
        setSelectedDevice(null);
      }
    } catch (err) {
      console.error("Error disconnecting device:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Web Bluetooth</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Connect and interact with Bluetooth Low Energy devices directly from
          your web browser
        </p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Device Scanner</CardTitle>
          <CardDescription className="text-sm">
            Scan for nearby Bluetooth devices and connect to them
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
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
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      {device.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ID: {device.id}
                    </p>
                    {device.services && device.services.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Connected to {device.services.length} service
                        {device.services.length > 1 ? "s" : ""}
                      </p>
                    )}
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
                      onClick={() =>
                        device.connected
                          ? disconnectDevice(device.id)
                          : connectToDevice(device.id)
                      }
                      disabled={isConnecting === device.id}
                      className="w-full sm:w-auto"
                    >
                      {isConnecting === device.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {device.connected
                            ? "Disconnecting..."
                            : "Connecting..."}
                        </>
                      ) : device.connected ? (
                        "Disconnect"
                      ) : (
                        "Connect"
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

      {selectedDevice?.connected && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Device Information
            </CardTitle>
            <CardDescription className="text-sm">
              Details about the connected device
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm sm:text-base">
                  Basic Information
                </h3>
                <div className="text-xs sm:text-sm space-y-1">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedDevice.name}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span> {selectedDevice.id}
                  </p>
                </div>
              </div>

              {selectedDevice.services &&
                selectedDevice.services.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      Available Services
                    </h3>
                    <div className="space-y-2">
                      {selectedDevice.services.map((service, index) => (
                        <div
                          key={index}
                          className="text-xs sm:text-sm p-2 bg-muted rounded-md"
                        >
                          <p className="font-medium">
                            Service UUID: {service.uuid}
                          </p>
                          {service.characteristics &&
                            service.characteristics.length > 0 && (
                              <div className="mt-1 pl-2 border-l-2 border-primary">
                                <p className="font-medium">Characteristics:</p>
                                {service.characteristics.map(
                                  (char, charIndex) => (
                                    <div key={charIndex} className="mt-1">
                                      <p>UUID: {char.uuid}</p>
                                      <p>
                                        Properties: {char.properties.join(", ")}
                                      </p>
                                      {char.value && <p>Value: {char.value}</p>}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Use Cases</CardTitle>
          <CardDescription className="text-sm">
            Common applications of Web Bluetooth API
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">
              Health & Fitness
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connect to heart rate monitors, fitness trackers, and other health
              devices
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">Smart Home</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Control smart bulbs, thermostats, and other IoT devices
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">Industrial</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Monitor sensors, control machinery, and collect data from
              industrial devices
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm sm:text-base">Gaming</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connect to game controllers and other gaming peripherals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
