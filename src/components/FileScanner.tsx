
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Folder, FileText, AlertCircle, CheckCircle, AlertTriangle, Ban, RefreshCw } from "lucide-react";
import { scanFile, scanFiles, getRandomScanMessage, ScanResult, ScanSummary } from "@/utils/scannerUtils";

interface FileScannerProps {
  onScanComplete?: (results: ScanResult[], summary: ScanSummary) => void;
  onBack?: () => void;
}

export function FileScanner({ onScanComplete, onBack }: FileScannerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [scanMessage, setScanMessage] = useState("Select files to scan");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [summary, setSummary] = useState<ScanSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setScanMessage(`${e.target.files.length} files selected`);
    }
  };

  const startScan = async () => {
    if (files.length === 0) return;
    
    setScanning(true);
    setProgress(0);
    setCurrentFile("");
    setScanMessage("Initializing scan...");
    setResults([]);
    
    const scanResults: ScanResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const percentComplete = Math.round((i / files.length) * 100);
      setProgress(percentComplete);
      setCurrentFile(file.name);
      
      // Update scan message every second
      setScanMessage(getRandomScanMessage());
      
      // Scan file
      const result = await scanFile(file);
      scanResults.push(result);
    }
    
    // Calculate summary
    const scanDuration = scanResults.reduce((total, result) => total + result.scanTime, 0) / 1000;
    const threatsFound = scanResults.reduce((total, result) => total + result.threats.length, 0);
    
    const threatsBySeverity = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    const threatsByType: Record<string, number> = {};
    
    scanResults.forEach(result => {
      result.threats.forEach(threat => {
        threatsBySeverity[threat.severity]++;
        
        if (!threatsByType[threat.type]) {
          threatsByType[threat.type] = 0;
        }
        threatsByType[threat.type]++;
      });
    });
    
    const scanSummary: ScanSummary = {
      scannedFiles: files.length,
      threatsFound,
      scanDuration,
      threatsBySeverity,
      threatsByType
    };
    
    setProgress(100);
    setCurrentFile("");
    setScanMessage("Scan completed");
    setResults(scanResults);
    setSummary(scanSummary);
    
    if (onScanComplete) {
      onScanComplete(scanResults, scanSummary);
    }
    
    setTimeout(() => {
      setScanning(false);
    }, 1000);
  };

  // Update scan message with animation effect
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;
    
    if (scanning && progress < 100) {
      messageInterval = setInterval(() => {
        setScanMessage(getRandomScanMessage());
      }, 2000);
    }
    
    return () => {
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [scanning, progress]);

  const resetScan = () => {
    setFiles([]);
    setProgress(0);
    setCurrentFile("");
    setScanMessage("Select files to scan");
    setResults([]);
    setSummary(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getThreatCount = (severity: 'low' | 'medium' | 'high' | 'critical'): number => {
    if (!summary) return 0;
    return summary.threatsBySeverity[severity];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-6 w-6 text-primary" />
          File Scanner
        </CardTitle>
        <CardDescription>
          Scan files for potential threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!scanning && results.length === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg border-muted p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="flex flex-col items-center space-y-2 text-center">
                <Folder className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm font-medium">{scanMessage}</div>
                <div className="text-xs text-muted-foreground">Click to browse or drop files here</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {files.length > 0 && (
              <div className="border rounded-lg p-2">
                <div className="text-sm font-medium mb-2">Selected Files ({files.length})</div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center text-xs p-1 hover:bg-muted/50 rounded-sm">
                      <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                      <div className="truncate">{file.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {scanning && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm flex justify-between">
                <span>{scanMessage}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            {currentFile && (
              <div className="text-xs text-muted-foreground flex items-center">
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                <span>Scanning: {currentFile}</span>
              </div>
            )}
          </div>
        )}

        {!scanning && results.length > 0 && summary && (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 mb-4 rounded-lg border bg-card">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <StatCard 
                  icon={<FileText className="h-4 w-4" />} 
                  value={summary.scannedFiles.toString()} 
                  label="Files Scanned" 
                />
                <StatCard 
                  icon={<AlertCircle className="h-4 w-4 text-destructive" />} 
                  value={summary.threatsFound.toString()} 
                  label="Threats Found" 
                  status={summary.threatsFound > 0 ? "critical" : "safe"}
                />
                <StatCard 
                  icon={<AlertCircle className="h-4 w-4 text-red-500" />} 
                  value={getThreatCount("critical").toString()} 
                  label="Critical Threats" 
                  status={getThreatCount("critical") > 0 ? "critical" : "safe"}
                />
                <StatCard 
                  icon={<AlertTriangle className="h-4 w-4 text-orange-500" />} 
                  value={getThreatCount("high").toString()} 
                  label="High Risk Threats" 
                  status={getThreatCount("high") > 0 ? "warning" : "safe"}
                />
              </div>
            </div>
            
            <div className="border rounded-lg divide-y">
              <div className="p-3 font-medium">Scan Results</div>
              {results.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No results to display</div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="p-3 hover:bg-muted/50 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {result.scanStatus === 'clean' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : result.scanStatus === 'infected' ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        )}
                        <div>
                          <div className="font-medium">{result.fileName}</div>
                          <div className="text-xs text-muted-foreground">{result.fileSize}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.scanStatus === 'clean' ? 'bg-green-500/20 text-green-500' :
                        result.scanStatus === 'infected' ? 'bg-red-500/20 text-red-500' :
                        'bg-orange-500/20 text-orange-500'
                      }`}>
                        {result.scanStatus === 'clean' ? 'Clean' :
                         result.scanStatus === 'infected' ? `${result.threats.length} threats` :
                         'Suspicious'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack || resetScan}>
          {results.length > 0 ? 'Back' : 'Cancel'}
        </Button>
        {!scanning && results.length === 0 && (
          <Button onClick={startScan} disabled={files.length === 0}>
            Start Scan
          </Button>
        )}
        {!scanning && results.length > 0 && (
          <Button onClick={resetScan}>
            New Scan
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  status?: 'safe' | 'warning' | 'critical';
}

function StatCard({ icon, value, label, status = 'safe' }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={`p-2 rounded-full mb-2 ${
        status === 'safe' ? 'bg-green-500/20' :
        status === 'warning' ? 'bg-orange-500/20' :
        'bg-red-500/20'
      }`}>
        {icon}
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
