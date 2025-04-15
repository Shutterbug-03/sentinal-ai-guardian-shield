
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  FileText, 
  Folder,
  ChevronRight
} from "lucide-react";

interface DashboardProps {
  onStartScan: () => void;
  lastScanDate?: string;
  threatsDetected?: number;
  protectionStatus?: "protected" | "at-risk" | "unknown";
}

export function Dashboard({ onStartScan, lastScanDate, threatsDetected = 0, protectionStatus = "protected" }: DashboardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Protection Status Card */}
      <Card className={`col-span-2 overflow-hidden ${
        protectionStatus === "protected" ? "border-green-500 shadow-green-500/20" : 
        protectionStatus === "at-risk" ? "border-red-500 shadow-red-500/20" : ""
      }`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            {protectionStatus === "protected" ? (
              <ShieldCheck className="h-6 w-6 text-green-500" />
            ) : (
              <ShieldAlert className="h-6 w-6 text-red-500" />
            )}
            Protection Status
          </CardTitle>
          <CardDescription>
            {protectionStatus === "protected" 
              ? "Your system is fully protected" 
              : "Your system requires attention"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">Real-time Protection</span>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                protectionStatus === "protected" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
              }`}>
                {protectionStatus === "protected" ? "Active" : "Inactive"}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">Last Scan</span>
              </div>
              <div className="text-sm">
                {lastScanDate || "No scan history"}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">Threats Detected</span>
              </div>
              <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                threatsDetected > 0 ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"
              }`}>
                {threatsDetected}
              </div>
            </div>
            
            <button 
              onClick={onStartScan} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <Folder className="h-4 w-4" />
              Start New Scan
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Protection</CardTitle>
          <CardDescription>Security metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <ProtectionMetric 
              label="Virus Database" 
              value="Updated" 
              status="good" 
            />
            <ProtectionMetric 
              label="Web Protection" 
              value="Active" 
              status="good" 
            />
            <ProtectionMetric 
              label="Firewall" 
              value="Enabled" 
              status="good" 
            />
            <ProtectionMetric 
              label="System Updates" 
              value="Checking..." 
              status="pending" 
            />
          </div>
        </CardContent>
      </Card>
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
