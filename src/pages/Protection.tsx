
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Lock, 
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Network,
  FolderLock,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Protection() {
  const navigate = useNavigate();
  const [protectionFeatures] = useState([
    { 
      id: "real-time",
      name: "Real-time Protection", 
      description: "Monitors system continuously for malware", 
      status: "active", 
      icon: ShieldCheck,
      lastUpdated: "2 minutes ago"
    },
    { 
      id: "web-shield",
      name: "Web Shield", 
      description: "Blocks malicious websites and downloads", 
      status: "active", 
      icon: Globe,
      lastUpdated: "15 minutes ago" 
    },
    { 
      id: "ransomware",
      name: "Ransomware Shield", 
      description: "Prevents unauthorized file encryption", 
      status: "active", 
      icon: FolderLock,
      lastUpdated: "1 hour ago" 
    },
    { 
      id: "network",
      name: "Network Inspector", 
      description: "Monitors network traffic for suspicious activity", 
      status: "active", 
      icon: Network,
      lastUpdated: "35 minutes ago" 
    },
    { 
      id: "behavior",
      name: "Behavior Shield", 
      description: "Analyzes application behavior for suspicious patterns", 
      status: "active", 
      icon: Activity,
      lastUpdated: "17 minutes ago" 
    },
    { 
      id: "identity",
      name: "Identity Protection", 
      description: "Protects personal information from theft", 
      status: "active", 
      icon: UserCheck,
      lastUpdated: "45 minutes ago" 
    }
  ]);
  
  const toggleProtectionFeature = (id: string) => {
    console.log(`Toggling protection feature: ${id}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={0} />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Protection Features</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Protection Status
              </CardTitle>
              <CardDescription>
                All protection features are currently active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Your system is fully protected</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {protectionFeatures.map(feature => (
            <Card key={feature.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <feature.icon className="h-5 w-5 text-primary" />
                  {feature.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span>Status:</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        feature.status === "active" 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-red-500/20 text-red-500"
                      }`}>
                        {feature.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button 
                      variant={feature.status === "active" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleProtectionFeature(feature.id)}
                    >
                      {feature.status === "active" ? "Disable" : "Enable"}
                    </Button>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {feature.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
