"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, Moon, Sun, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  fontSize: number;
  notifications: boolean;
  language: string;
  compactMode: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  fontSize: 16,
  notifications: true,
  language: "en",
  compactMode: false,
};

export function LocalStorageExample() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Check if localStorage is available
  useEffect(() => {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
    } catch (e) {
      setStorageAvailable(false);
    }
  }, []);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    if (!storageAvailable) return;

    try {
      const storedPrefs = localStorage.getItem("userPreferences");
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
    } catch (e) {
      setError("Failed to load preferences from localStorage");
      console.error("Error loading preferences:", e);
    }
  }, [storageAvailable]);

  // Save preferences to localStorage
  const savePreferences = () => {
    if (!storageAvailable) {
      setError("localStorage is not available in your browser");
      return;
    }

    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError("Failed to save preferences to localStorage");
      console.error("Error saving preferences:", e);
    }
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    if (!storageAvailable) {
      setError("localStorage is not available in your browser");
      return;
    }

    try {
      localStorage.removeItem("userPreferences");
      setPreferences(defaultPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError("Failed to reset preferences");
      console.error("Error resetting preferences:", e);
    }
  };

  // Update a specific preference
  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply theme based on preferences
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = preferences;
      const root = document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // System preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        prefersDark
          ? root.classList.add("dark")
          : root.classList.remove("dark");
      }
    };

    applyTheme();
  }, [preferences]);

  if (!storageAvailable) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          localStorage is not available in your browser. This could be due to
          private browsing mode, browser settings, or storage permissions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Theme</h3>
                <RadioGroup
                  value={preferences.theme}
                  onValueChange={(value) =>
                    updatePreference(
                      "theme",
                      value as "light" | "dark" | "system",
                    )
                  }
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center">
                      <Sun className="h-4 w-4 mr-1" /> Light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center">
                      <Moon className="h-4 w-4 mr-1" /> Dark
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center">
                      <Monitor className="h-4 w-4 mr-1" /> System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="font-size">
                    Font Size: {preferences.fontSize}px
                  </Label>
                </div>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[preferences.fontSize]}
                  onValueChange={(value) =>
                    updatePreference("fontSize", value[0])
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={preferences.notifications}
                  onCheckedChange={(checked) =>
                    updatePreference("notifications", checked)
                  }
                />
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="compact-mode"
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) =>
                    updatePreference("compactMode", checked)
                  }
                />
                <Label htmlFor="compact-mode">Compact Mode</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => updatePreference("language", value)}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Preview</h3>
              <div
                className={`p-4 rounded-md border ${
                  preferences.theme === "dark"
                    ? "bg-gray-800 text-white"
                    : preferences.theme === "light"
                      ? "bg-white text-gray-800"
                      : "bg-gray-100 text-gray-800"
                }`}
                style={{ fontSize: `${preferences.fontSize}px` }}
              >
                <div
                  className={`space-y-2 ${preferences.compactMode ? "leading-tight" : "leading-relaxed"}`}
                >
                  <h4 className="font-bold">Sample Content</h4>
                  <p>
                    This is how your content will appear with the selected
                    preferences.
                  </p>
                  <p>
                    Notifications:{" "}
                    {preferences.notifications ? "Enabled" : "Disabled"}
                  </p>
                  <p>
                    Language:{" "}
                    {preferences.language === "en"
                      ? "English"
                      : preferences.language === "es"
                        ? "Español"
                        : preferences.language === "fr"
                          ? "Français"
                          : preferences.language === "de"
                            ? "Deutsch"
                            : preferences.language === "ja"
                              ? "日本語"
                              : preferences.language}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">localStorage Code</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`// Save preferences to localStorage
localStorage.setItem('userPreferences', 
  JSON.stringify({
    theme: '${preferences.theme}',
    fontSize: ${preferences.fontSize},
    notifications: ${preferences.notifications},
    language: '${preferences.language}',
    compactMode: ${preferences.compactMode}
  })
);

// Retrieve preferences from localStorage
const storedPrefs = localStorage.getItem('userPreferences');
const preferences = storedPrefs ? JSON.parse(storedPrefs) : defaultPreferences;

// Remove preferences from localStorage
localStorage.removeItem('userPreferences');`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetPreferences}
          className="flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button onClick={savePreferences} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saved && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <AlertDescription>Preferences saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="rounded-md bg-muted p-4">
        <h4 className="text-sm font-medium mb-2">How it works:</h4>
        <p className="text-sm text-muted-foreground">
          This example demonstrates using localStorage to persist user
          preferences across browser sessions. When you change settings and
          click "Save Preferences", the data is stored in your browser's
          localStorage. When you reload the page, your preferences are
          automatically loaded from localStorage.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          localStorage is ideal for small amounts of data like user preferences,
          theme settings, and UI state. The data persists even when the browser
          is closed and reopened, but is limited to about 5MB per domain.
        </p>
      </div>
    </div>
  );
}
