
import { useState } from "react";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, FileText, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScanResult } from "@/utils/scannerUtils";

// Mock data for scan history with more detailed information
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
    threats: []
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
        severity: "medium",
        type: "malware",
        detectionMethod: "Signature matching"
      },
      {
        id: "spy-003",
        name: "Sentinel.Spyware.KeyLogger",
        filePath: "downloads/free-tool.exe",
        severity: "high",
        type: "spyware",
        detectionMethod: "Heuristic analysis"
      }
    ]
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
        severity: "critical",
        type: "ransomware",
        detectionMethod: "Behavioral analysis"
      }
    ]
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
    threats: []
  }
];

export default function ScanHistory() {
  const navigate = useNavigate();
  const [scanHistory] = useState(mockScanHistory);
  
  const viewScanDetails = (scanId: string) => {
    navigate(`/scan-details/${scanId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={3} />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Scan History</h1>
        </div>
        
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Files Scanned</TableHead>
                <TableHead>Threats</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanHistory.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(scan.date, "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(scan.date, "hh:mm a")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {scan.status === "clean" ? (
                        <>
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">Clean</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                          <span className="text-red-500">Threats Detected</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {scan.filesScanned.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      scan.threatsDetected > 0 
                        ? "bg-red-500/20 text-red-500" 
                        : "bg-green-500/20 text-green-500"
                    }`}>
                      {scan.threatsDetected}
                    </span>
                  </TableCell>
                  <TableCell>{scan.duration}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => viewScanDetails(scan.id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
