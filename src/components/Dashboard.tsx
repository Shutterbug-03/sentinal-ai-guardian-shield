
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  Settings,
  LineChart,
  Lock,
  Brain,
  Scan
} from "lucide-react";
import { useProtectionStore } from "@/store/protectionStore";
import { useScanHistoryStore } from "@/store/scanHistoryStore";
import { evaluateSystemRisk } from "@/utils/aiThreatDetection";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onStartScan: () => void;
  lastScanDate?: string;
  threatsDetected?: number;
}

export function Dashboard({ onStartScan, lastScanDate = "", threatsDetected = 0 }: DashboardProps) {
  const navigate = useNavigate();
  const { features, aiEnabled } = useProtectionStore();
  const { scans } = useScanHistoryStore();
  const [protectionStatus, setProtectionStatus] = useState<"protected" | "at-risk" | "compromised">("protected");
  
  useEffect(() => {
    // Determine protection status
    if (aiEnabled) {
      const activeFeatureCount = features.filter(feature => feature.status === 'active').length;
      const { status } = evaluateSystemRisk(scans, activeFeatureCount);
      setProtectionStatus(status === 'safe' ? 'protected' : status as any);
    } else {
      const inactiveFeatures = features.filter(feature => feature.status === 'inactive');
      setProtectionStatus(inactiveFeatures.length > 0 ? 'at-risk' : 'protected');
    }
  }, [features, scans, aiEnabled]);

  // Get main protection features only (first 3)
  const mainFeatures = features.filter(feature => feature.status === 'active').slice(0, 3);
  
  return (
    <div className="flex flex-col gap-6">
      {/* Scan Button at the top */}
      <div className="flex justify-center w-full">
        <Button 
          onClick={onStartScan}
          className="px-8 py-6 text-lg font-medium flex items-center gap-3 shadow-lg hover:shadow-xl transition-all"
        >
          <Scan className="h-6 w-6" />
          Start New System Scan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Protection Status Card */}
        <Card 
          className={`col-span-2 overflow-hidden ${
            protectionStatus === "protected" ? "border-green-500 shadow-green-500/20" : 
            protectionStatus === "at-risk" ? "border-yellow-500 shadow-yellow-500/20" :
            "border-red-500 shadow-red-500/20"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              {protectionStatus === "protected" ? (
                <ShieldCheck className="h-6 w-6 text-green-500" />
              ) : protectionStatus === "at-risk" ? (
                <ShieldAlert className="h-6 w-6 text-yellow-500" />
              ) : (
                <ShieldX className="h-6 w-6 text-red-500" />
              )}
              Real-Time Protection Status
            </CardTitle>
            <CardDescription>
              {protectionStatus === "protected" 
                ? "Your system is fully protected" 
                : protectionStatus === "at-risk"
                ? "Your system requires attention"
                : "Critical security issue detected"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium mb-2">Main Active Protections</h3>
              {mainFeatures.length > 0 ? (
                mainFeatures.map(feature => (
                  <div 
                    key={feature.id}
                    className="flex justify-between items-center p-2 rounded-md bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="text-primary h-5 w-5" />
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                      Active
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No active protection features.
                  <div className="mt-2">
                    <button 
                      onClick={() => navigate("/protection")}
                      className="text-primary hover:underline"
                    >
                      Enable protection features
                    </button>
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => navigate("/protection")} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                Manage Protection Features
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/protection")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Protection Summary</span>
            </CardTitle>
            <CardDescription>Active security measures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <ProtectionMetric 
                label="Active Features" 
                value={`${features.filter(feature => feature.status === 'active').length}/${features.length}`} 
                status={features.filter(feature => feature.status === 'active').length === features.length ? "good" : features.filter(feature => feature.status === 'active').length === 0 ? "critical" : "warning"} 
              />
              <ProtectionMetric 
                label="AI Protection" 
                value={aiEnabled ? "Active" : "Inactive"} 
                status={aiEnabled ? "good" : "pending"} 
              />
              <ProtectionMetric 
                label="Learning Mode" 
                value={aiEnabled && useProtectionStore.getState().aiLearningMode ? "Active" : "Inactive"} 
                status={aiEnabled && useProtectionStore.getState().aiLearningMode ? "good" : "pending"} 
              />
              <ProtectionMetric 
                label="System Status" 
                value={protectionStatus === "protected" ? "Protected" : protectionStatus === "at-risk" ? "At Risk" : "Alert"} 
                status={protectionStatus === "protected" ? "good" : protectionStatus === "at-risk" ? "warning" : "critical"} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Cards */}
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/scan-history")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <span>Scan History</span>
            </CardTitle>
            <CardDescription>View previous scan results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center py-4">
              <p className="text-sm">Access detailed reports of previous scans and threat detections</p>
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  onStartScan(); 
                }} 
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm transition-colors"
              >
                Run New Scan
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/settings")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Settings</span>
            </CardTitle>
            <CardDescription>Configure security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center py-4">
              <Lock className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm">Customize scan options, scheduling, and protection features</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ProtectionMetricProps {
  label: string;
  value: string;
  status: "good" | "warning" | "critical" | "pending";
}

function ProtectionMetric({ label, value, status }: ProtectionMetricProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
        status === "good" ? "bg-green-500/20 text-green-500" :
        status === "warning" ? "bg-yellow-500/20 text-yellow-500" :
        status === "critical" ? "bg-red-500/20 text-red-500" :
        "bg-blue-500/20 text-blue-500"
      }`}>{value}</span>
    </div>
  );
}
