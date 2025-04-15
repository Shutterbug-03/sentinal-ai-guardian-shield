
import { useState, useEffect } from "react";
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
import { useScanHistoryStore } from "@/store/scanHistoryStore";

export default function ScanHistory() {
  const navigate = useNavigate();
  const { scans } = useScanHistoryStore();
  
  const viewScanDetails = (scanId: string) => {
    navigate(`/scan-details/${scanId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={3} />
      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Scan History</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            New Scan
          </Button>
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
              {scans.map((scan) => (
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
