
import { create } from 'zustand';
import { ScanResult, ScanSummary, Threat } from '@/utils/scannerUtils';

export interface ScanHistoryItem {
  id: string;
  date: Date;
  duration: string;
  filesScanned: number;
  threatsDetected: number;
  status: 'clean' | 'threats-found';
  summary: ScanSummary;
  threats: Threat[];
}

interface ScanHistoryState {
  scans: ScanHistoryItem[];
  addScan: (scan: ScanHistoryItem) => void;
  getScans: () => ScanHistoryItem[];
}

// Initial data from mock history
const initialScans: ScanHistoryItem[] = [
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
        severity: "critical" as "critical",
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

export const useScanHistoryStore = create<ScanHistoryState>((set, get) => ({
  scans: initialScans,
  addScan: (scan) => set((state) => ({ 
    scans: [scan, ...state.scans] 
  })),
  getScans: () => get().scans
}));
