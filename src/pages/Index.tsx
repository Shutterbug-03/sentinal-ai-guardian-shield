import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { FileScanner } from "@/components/FileScanner";
import { ThreatReport } from "@/components/ThreatReport";
import { ScanResult, ScanSummary, Threat, formatFileSize } from "@/utils/scannerUtils";
import { useScanHistoryStore, ScanHistoryItem } from "@/store/scanHistoryStore";
import { useProtectionStore } from "@/store/protectionStore";
import { useToast } from "@/hooks/use-toast";
import { initializeThreatModel } from "@/utils/aiThreatDetection";

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
  const { addScan, scans } = useScanHistoryStore();
  const { aiEnabled, aiLearningMode } = useProtectionStore();
  const { toast } = useToast();
  
  // Initialize AI model
  useEffect(() => {
    if (aiEnabled && scans.length > 0) {
      initializeThreatModel(scans).then(() => {
        console.log('AI threat model initialized');
      });
    }
  }, [aiEnabled, scans]);
  
  // Calculate threats from scan history
  useEffect(() => {
    const threats = scans.flatMap(scan => scan.threats);
    setAllThreats(threats);
  }, [scans]);
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const handleScanComplete = (results: ScanResult[], summary: ScanSummary) => {
    setScanResults(results);
    setScanSummary(summary);
    const currentDate = new Date();
    setLastScanDate(currentDate.toLocaleString());
    
    // Extract all threats from results
    const threats = results.flatMap(result => result.threats);
    setAllThreats(prev => [...threats, ...prev]);
    
    // Create a new scan history item
    const newScanId = `scan-${Date.now().toString().substring(7)}`;
    const newScanHistoryItem: ScanHistoryItem = {
      id: newScanId,
      date: currentDate,
      duration: formatDuration(summary.scanDuration),
      filesScanned: summary.scannedFiles,
      threatsDetected: summary.threatsFound,
      status: summary.threatsFound > 0 ? "threats-found" : "clean",
      summary,
      threats
    };
    
    // Add to scan history
    addScan(newScanHistoryItem);
    
    // Show toast notification
    toast({
      title: "Scan Complete",
      description: `Scanned ${summary.scannedFiles} files in ${formatDuration(summary.scanDuration)}. Found ${summary.threatsFound} threats.`,
      variant: summary.threatsFound > 0 ? "destructive" : "default",
    });
    
    // Train AI model if learning mode is enabled
    if (aiEnabled && aiLearningMode) {
      initializeThreatModel([...scans, newScanHistoryItem]).then(() => {
        console.log('AI model updated with new scan data');
      });
    }
    
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
            lastScanDate={lastScanDate || (scans.length > 0 ? scans[0].date.toLocaleString() : "")}
            threatsDetected={allThreats.length}
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
      {/* Footer removed as requested */}
    </div>
  );
}
