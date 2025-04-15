
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanSettings, setScanSettings] = useState({
    deepScan: true,
    autoScan: false,
    scanFrequency: "daily",
    scanOnStartup: true,
    scanDownloads: true,
    quarantineDetected: true,
    updateDatabase: true,
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to a database or local storage
    toast({
      title: "Settings Saved",
      description: "Your security preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={0} />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Configuration</CardTitle>
              <CardDescription>Configure how Sentinel-AI scans your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deep-scan">Deep Scan</Label>
                  <p className="text-sm text-muted-foreground">
                    Perform thorough scanning of all files (may take longer)
                  </p>
                </div>
                <Switch
                  id="deep-scan"
                  checked={scanSettings.deepScan}
                  onCheckedChange={(checked) =>
                    setScanSettings({ ...scanSettings, deepScan: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-scan">Automatic Scanning</Label>
                  <p className="text-sm text-muted-foreground">
                    Schedule automatic scans of your system
                  </p>
                </div>
                <Switch
                  id="auto-scan"
                  checked={scanSettings.autoScan}
                  onCheckedChange={(checked) =>
                    setScanSettings({ ...scanSettings, autoScan: checked })
                  }
                />
              </div>
              {scanSettings.autoScan && (
                <div className="grid gap-2 pt-2">
                  <Label htmlFor="scan-frequency">Scan Frequency</Label>
                  <select
                    id="scan-frequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={scanSettings.scanFrequency}
                    onChange={(e) =>
                      setScanSettings({
                        ...scanSettings,
                        scanFrequency: e.target.value,
                      })
                    }
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Protection Settings</CardTitle>
              <CardDescription>
                Configure real-time protection features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="scan-startup">Scan on Startup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan system when computer starts
                  </p>
                </div>
                <Switch
                  id="scan-startup"
                  checked={scanSettings.scanOnStartup}
                  onCheckedChange={(checked) =>
                    setScanSettings({ ...scanSettings, scanOnStartup: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="scan-downloads">Scan Downloads</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan files when downloaded
                  </p>
                </div>
                <Switch
                  id="scan-downloads"
                  checked={scanSettings.scanDownloads}
                  onCheckedChange={(checked) =>
                    setScanSettings({ ...scanSettings, scanDownloads: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quarantine">Quarantine Detected Threats</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically isolate detected malware
                  </p>
                </div>
                <Switch
                  id="quarantine"
                  checked={scanSettings.quarantineDetected}
                  onCheckedChange={(checked) =>
                    setScanSettings({
                      ...scanSettings,
                      quarantineDetected: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="update-db">Auto Update Virus Database</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep virus definitions updated automatically
                  </p>
                </div>
                <Switch
                  id="update-db"
                  checked={scanSettings.updateDatabase}
                  onCheckedChange={(checked) =>
                    setScanSettings({ ...scanSettings, updateDatabase: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2023 Sentinel-AI Guardian Shield. All rights reserved.</p>
          <p className="text-xs mt-1">Safeguarding your digital world with AI-powered protection.</p>
        </div>
      </footer>
    </div>
  );
}
