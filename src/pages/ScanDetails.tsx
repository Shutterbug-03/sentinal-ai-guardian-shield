
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ThreatReport } from "@/components/ThreatReport";
import { ScanSummary, Threat } from "@/utils/scannerUtils";
import { useScanHistoryStore } from "@/store/scanHistoryStore";

export default function ScanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scans } = useScanHistoryStore();
  const [scanData, setScanData] = useState<{
    id: string;
    date: Date;
    summary: ScanSummary;
    threats: Threat[];
  } | null>(null);
  
  useEffect(() => {
    // Find the scan with the matching ID from our scan history store
    const scan = scans.find(scan => scan.id === id);
    
    if (scan) {
      setScanData({
        id: scan.id,
        date: scan.date,
        summary: scan.summary,
        threats: scan.threats
      });
    }
  }, [id, scans]);
  
  if (!scanData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header threatCount={3} />
        <main className="flex-1 container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/scan-history")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Scan Report</h1>
          </div>
          <div className="p-8 text-center">
            <p>Scan not found. The requested scan may have been deleted or does not exist.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/scan-history")}
            >
              Return to Scan History
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  const formattedDate = scanData.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={3} />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/scan-history")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Scan Report</h1>
            <p className="text-sm text-muted-foreground">
              {formattedDate} • Scan ID: {scanData.id}
            </p>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <ThreatReport
            summary={scanData.summary}
            threats={scanData.threats}
            onBack={() => navigate("/scan-history")}
          />
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
