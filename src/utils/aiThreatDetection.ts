
import * as tf from '@tensorflow/tfjs';
import { Threat } from './scannerUtils';
import { ScanHistoryItem } from '@/store/scanHistoryStore';

// Initialize the model
let threatDetectionModel: tf.Sequential | null = null;

// Feature names for our model
const FEATURE_NAMES = ['type', 'severity'];

// Map threat types to numeric values
const threatTypeToNumber: Record<string, number> = {
  'malware': 0,
  'spyware': 1,
  'trojan': 2,
  'adware': 3,
  'ransomware': 4,
  'rootkit': 5,
  'worm': 6,
  'backdoor': 7,
  'botnet': 8,
  'virus': 9,
};

// Map severity to numeric values
const severityToNumber: Record<string, number> = {
  'low': 0,
  'medium': 1,
  'high': 2,
  'critical': 3,
};

// Initialize the model
export async function initializeThreatModel(scanHistory: ScanHistoryItem[]): Promise<void> {
  // Extract threats from scan history
  const allThreats = scanHistory.flatMap(scan => scan.threats);
  
  if (allThreats.length < 5) {
    console.log('Not enough threat data to train a model');
    return;
  }

  // Create a simple model
  threatDetectionModel = tf.sequential();
  
  // Add layers to the model
  threatDetectionModel.add(tf.layers.dense({
    units: 10,
    inputShape: [2],
    activation: 'relu'
  }));
  
  threatDetectionModel.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  }));
  
  // Compile the model
  threatDetectionModel.compile({
    optimizer: tf.train.adam(),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  // Prepare training data
  const features = allThreats.map(threat => [
    threatTypeToNumber[threat.type] || 0,
    severityToNumber[threat.severity] || 0
  ]);
  
  // Simple labeling: higher severity threats are more dangerous
  const labels = allThreats.map(threat => 
    severityToNumber[threat.severity] > 1 ? 1 : 0
  );
  
  // Convert to tensors
  const xs = tf.tensor2d(features);
  const ys = tf.tensor1d(labels);
  
  // Train the model
  await threatDetectionModel.fit(xs, ys, {
    epochs: 10,
    batchSize: 4,
    shuffle: true
  });
  
  console.log('Threat detection model trained successfully');
  
  // Clean up tensors
  xs.dispose();
  ys.dispose();
}

// Analyze a file path using AI to determine if it might be suspicious
export function analyzeFilePath(filePath: string): number {
  if (!threatDetectionModel) {
    console.log('Threat model not initialized');
    return 0;
  }
  
  // Simple heuristics for demo purposes
  const hasExecutableExtension = /\.(exe|bat|cmd|msi|dll|sh|jar)$/i.test(filePath);
  const hasSuspiciousKeywords = /(crack|keygen|patch|warez|torrent|pirate)/i.test(filePath);
  const isFromDownloads = filePath.includes('download') || filePath.includes('temp');
  
  // Convert features to what our model expects
  const featureVector = [
    isFromDownloads ? 1 : 0,
    (hasExecutableExtension ? 1 : 0) + (hasSuspiciousKeywords ? 1 : 0)
  ];
  
  // Run inference
  const prediction = threatDetectionModel.predict(tf.tensor2d([featureVector])) as tf.Tensor;
  const score = prediction.dataSync()[0];
  
  // Clean up
  prediction.dispose();
  
  return score;
}

// Evaluate the risk level of the system based on scan history
export function evaluateSystemRisk(scanHistory: ScanHistoryItem[]): {
  score: number;
  status: 'safe' | 'at-risk' | 'compromised';
} {
  // No history means we can't determine risk
  if (scanHistory.length === 0) {
    return { score: 0, status: 'safe' };
  }

  // Count recent threats (last 3 scans)
  const recentScans = scanHistory.slice(0, 3);
  const recentThreats = recentScans.flatMap(scan => scan.threats);
  
  // Count by severity
  const criticalCount = recentThreats.filter(t => t.severity === 'critical').length;
  const highCount = recentThreats.filter(t => t.severity === 'high').length;
  const mediumCount = recentThreats.filter(t => t.severity === 'medium').length;
  
  // Calculate risk score (weighted by severity)
  const score = criticalCount * 10 + highCount * 5 + mediumCount * 2;
  
  // Determine status
  let status: 'safe' | 'at-risk' | 'compromised';
  if (criticalCount > 0) {
    status = 'compromised';
  } else if (highCount > 0 || score > 5) {
    status = 'at-risk';
  } else {
    status = 'safe';
  }
  
  return { score, status };
}
