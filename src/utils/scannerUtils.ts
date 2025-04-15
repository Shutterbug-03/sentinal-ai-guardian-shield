
// Utility functions for the Sentinel-AI scanner

// Mock threat database for demonstration
export const knownThreats: Array<Omit<Threat, 'filePath' | 'detectionMethod'>> = [
  { id: 'trj-001', name: 'Sentinel.Trojan.Agent', severity: 'high', type: 'trojan' },
  { id: 'adw-002', name: 'Sentinel.Adware.Banner', severity: 'medium', type: 'adware' },
  { id: 'spy-003', name: 'Sentinel.Spyware.KeyLogger', severity: 'high', type: 'spyware' },
  { id: 'ran-004', name: 'Sentinel.Ransomware.Encrypt', severity: 'critical', type: 'ransomware' },
  { id: 'rkt-005', name: 'Sentinel.Rootkit.Hidden', severity: 'critical', type: 'rootkit' },
  { id: 'mal-006', name: 'Sentinel.Malware.Generic', severity: 'medium', type: 'malware' },
  { id: 'wrm-007', name: 'Sentinel.Worm.Spread', severity: 'high', type: 'worm' },
  { id: 'bdr-008', name: 'Sentinel.Backdoor.Access', severity: 'high', type: 'backdoor' },
  { id: 'bot-009', name: 'Sentinel.Botnet.Client', severity: 'medium', type: 'botnet' },
  { id: 'fil-010', name: 'Sentinel.FileInfector', severity: 'medium', type: 'virus' },
];

export interface ScanResult {
  fileName: string;
  filePath: string;
  fileSize: string;
  scanStatus: 'clean' | 'infected' | 'suspicious';
  threats: Threat[];
  scanTime: number;
}

export interface ScanSummary {
  scannedFiles: number;
  threatsFound: number;
  scanDuration: number;
  threatsBySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  threatsByType: Record<string, number>;
}

export interface Threat {
  id: string;
  name: string;
  filePath: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  detectionMethod?: string;
}

// Simulate file scanning process
export const scanFile = async (file: File): Promise<ScanResult> => {
  return new Promise((resolve) => {
    // Simulate scanning delay - random between 1-3 seconds
    const scanTime = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      // Random result generation (for demo purposes)
      const shouldDetectThreat = Math.random() < 0.3; // 30% chance of finding a threat
      const threats: Threat[] = [];
      let scanStatus: 'clean' | 'infected' | 'suspicious' = 'clean';
      
      if (shouldDetectThreat) {
        // Select 1-3 random threats from the database
        const threatCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < threatCount; i++) {
          const threat = { 
            ...knownThreats[Math.floor(Math.random() * knownThreats.length)],
            filePath: `${file.name}`,
            detectionMethod: Math.random() > 0.5 ? 'Signature matching' : 'Heuristic analysis'
          };
          threats.push(threat);
        }
        
        // Determine status based on threats
        if (threats.some(threat => threat.severity === 'critical' || threat.severity === 'high')) {
          scanStatus = 'infected';
        } else {
          scanStatus = 'suspicious';
        }
      }
      
      resolve({
        fileName: file.name,
        filePath: file.name, // In a real app, this would be the full path
        fileSize: formatFileSize(file.size),
        scanStatus,
        threats,
        scanTime
      });
    }, scanTime);
  });
};

// Simulate multiple file scanning
export const scanFiles = async (files: File[]): Promise<ScanSummary> => {
  const startTime = performance.now();
  const results: ScanResult[] = [];
  
  for (const file of files) {
    const result = await scanFile(file);
    results.push(result);
  }
  
  const endTime = performance.now();
  const scanDuration = Math.round((endTime - startTime) / 1000);
  
  // Compile scan summary
  const threatsFound = results.reduce((sum, result) => sum + result.threats.length, 0);
  
  // Count threats by severity
  const threatsBySeverity = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };
  
  // Count threats by type
  const threatsByType: Record<string, number> = {};
  
  results.forEach(result => {
    result.threats.forEach(threat => {
      threatsBySeverity[threat.severity]++;
      
      if (!threatsByType[threat.type]) {
        threatsByType[threat.type] = 0;
      }
      threatsByType[threat.type]++;
    });
  });
  
  return {
    scannedFiles: files.length,
    threatsFound,
    scanDuration,
    threatsBySeverity,
    threatsByType
  };
};

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate random scanning progress messages
export function getRandomScanMessage(): string {
  const messages = [
    "Analyzing file structure...",
    "Checking for known signatures...",
    "Running heuristic analysis...",
    "Scanning memory for threats...",
    "Examining file metadata...",
    "Inspecting executable code...",
    "Analyzing network activity...",
    "Checking for suspicious patterns...",
    "Performing deep scan...",
    "Validating file integrity...",
    "Scanning registry references...",
    "Checking for encrypted content...",
    "Analyzing behavioral patterns...",
    "Inspecting system modifications..."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
