
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { FileScanner } from "@/components/FileScanner";
import { ThreatReport } from "@/components/ThreatReport";
import { ScanResult, ScanSummary, Threat } from "@/utils/scannerUtils";

enum AppView {
  DASHBOARD,
  SCANNER,
  REPORT
}

export default function Index() {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [lastScanDate, setLastScanDate] = useState<string>("");
  const [allThreats, setAllThreats] = useState<Threat[]>([]);
  
  const handleScanComplete = (results: ScanResult[], summary: ScanSummary) => {
    setScanResults(results);
    setScanSummary(summary);
    setLastScanDate(new Date().toLocaleString());
    
    // Extract all threats from results
    const threats = results.flatMap(result => result.threats);
    setAllThreats(threats);
    
    // Show the report view
    setView(AppView.REPORT);
  };
  
  const startNewScan = () => {
    setView(AppView.SCANNER);
  };
  
  const goToDashboard = () => {
    setView(AppView.DASHBOARD);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={allThreats.length} />
      <main className="flex-1 container py-8">
        {view === AppView.DASHBOARD && (
          <Dashboard 
            onStartScan={startNewScan} 
            lastScanDate={lastScanDate}
            threatsDetected={allThreats.length}
            protectionStatus={allThreats.length > 0 ? "at-risk" : "protected"}
          />
        )}
        
        {view === AppView.SCANNER && (
          <FileScanner 
            onScanComplete={handleScanComplete}
            onBack={goToDashboard}
          />
        )}
        
        {view === AppView.REPORT && scanSummary && (
          <ThreatReport 
            summary={scanSummary}
            threats={allThreats}
            onBack={goToDashboard}
          />
        )}
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
