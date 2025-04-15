
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ThreatReport } from "@/components/ThreatReport";
import { ScanSummary, Threat } from "@/utils/scannerUtils";

// Import mock data from ScanHistory
// In a real app, this would come from an API or database
const mockScanHistory = [
  {
    id: "scan-001",
    date: new Date(2023, 3, 15, 9, 30),
    duration: "3m 42s",
    filesScanned: 1245,
    threatsDetected: 0,
    status: "clean",
    summary: {
      scannedFiles: 1245,
      threatsFound: 0,
      scanDuration: 222,
      threatsBySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      threatsByType: {}
    },
    threats: [] as Threat[]
  },
  {
    id: "scan-002",
    date: new Date(2023, 3, 10, 14, 15),
    duration: "5m 18s",
    filesScanned: 2103,
    threatsDetected: 2,
    status: "threats-found",
    summary: {
      scannedFiles: 2103,
      threatsFound: 2,
      scanDuration: 318,
      threatsBySeverity: {
        low: 0,
        medium: 1,
        high: 1,
        critical: 0
      },
      threatsByType: {
        "malware": 1,
        "spyware": 1
      }
    },
    threats: [
      {
        id: "mal-006",
        name: "Sentinel.Malware.Generic",
        filePath: "downloads/suspicious-file.exe",
        severity: "medium" as "medium",
        type: "malware",
        detectionMethod: "Signature matching"
      },
      {
        id: "spy-003",
        name: "Sentinel.Spyware.KeyLogger",
        filePath: "downloads/free-tool.exe",
        severity: "high" as "high",
        type: "spyware",
        detectionMethod: "Heuristic analysis"
      }
    ] as Threat[]
  },
  {
    id: "scan-003",
    date: new Date(2023, 3, 5, 10, 0),
    duration: "4m 9s",
    filesScanned: 1876,
    threatsDetected: 1,
    status: "threats-found",
    summary: {
      scannedFiles: 1876,
      threatsFound: 1,
      scanDuration: 249,
      threatsBySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 1
      },
      threatsByType: {
        "ransomware": 1
      }
    },
    threats: [
      {
        id: "ran-004",
        name: "Sentinel.Ransomware.Encrypt",
        filePath: "downloads/attachment.zip",
        severity: "critical" as "critical",
        type: "ransomware",
        detectionMethod: "Behavioral analysis"
      }
    ] as Threat[]
  },
  {
    id: "scan-004",
    date: new Date(2023, 2, 28, 19, 45),
    duration: "2m 56s",
    filesScanned: 943,
    threatsDetected: 0,
    status: "clean",
    summary: {
      scannedFiles: 943,
      threatsFound: 0,
      scanDuration: 176,
      threatsBySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      threatsByType: {}
    },
    threats: [] as Threat[]
  }
];

export default function ScanDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scanData, setScanData] = useState<{
    id: string;
    date: Date;
    summary: ScanSummary;
    threats: Threat[];
  } | null>(null);
  
  useEffect(() => {
    // Find the scan with the matching ID from our mock data
    const scan = mockScanHistory.find(scan => scan.id === id);
    
    if (scan) {
      setScanData({
        id: scan.id,
        date: scan.date,
        summary: scan.summary,
        threats: scan.threats
      });
    }
  }, [id]);
  
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
