
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProtectionFeature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  icon: string;
  lastUpdated: string;
}

interface ProtectionState {
  features: ProtectionFeature[];
  aiEnabled: boolean;
  aiLearningMode: boolean;
  systemStatus: 'protected' | 'at-risk' | 'compromised';
  toggleFeature: (id: string) => void;
  toggleAI: () => void;
  toggleAILearning: () => void;
  setSystemStatus: (status: 'protected' | 'at-risk' | 'compromised') => void;
  updateLastUpdated: (id: string) => void;
}

export const useProtectionStore = create<ProtectionState>()(
  persist(
    (set, get) => ({
      features: [
        { 
          id: "real-time",
          name: "Real-time Protection", 
          description: "Monitors system continuously for malware", 
          status: "active", 
          icon: "ShieldCheck",
          lastUpdated: "1 minute ago"
        },
        { 
          id: "web-shield",
          name: "Web Shield", 
          description: "Blocks malicious websites and downloads", 
          status: "active", 
          icon: "Globe",
          lastUpdated: "15 minutes ago" 
        },
        { 
          id: "ransomware",
          name: "Ransomware Shield", 
          description: "Prevents unauthorized file encryption", 
          status: "active", 
          icon: "FolderLock",
          lastUpdated: "1 hour ago" 
        },
        { 
          id: "network",
          name: "Network Inspector", 
          description: "Monitors network traffic for suspicious activity", 
          status: "active", 
          icon: "Network",
          lastUpdated: "35 minutes ago" 
        },
        { 
          id: "behavior",
          name: "Behavior Shield", 
          description: "Analyzes application behavior for suspicious patterns", 
          status: "active", 
          icon: "Activity",
          lastUpdated: "17 minutes ago" 
        },
        { 
          id: "identity",
          name: "Identity Protection", 
          description: "Protects personal information from theft", 
          status: "active", 
          icon: "UserCheck",
          lastUpdated: "45 minutes ago" 
        }
      ],
      aiEnabled: true,
      aiLearningMode: false,
      systemStatus: 'protected',
      toggleFeature: (id) => set(state => ({
        features: state.features.map(feature => 
          feature.id === id 
            ? { 
                ...feature, 
                status: feature.status === 'active' ? 'inactive' : 'active',
                lastUpdated: 'Just now'
              } 
            : feature
        )
      })),
      toggleAI: () => set(state => ({ aiEnabled: !state.aiEnabled })),
      toggleAILearning: () => set(state => ({ aiLearningMode: !state.aiLearningMode })),
      setSystemStatus: (status) => set({ systemStatus: status }),
      updateLastUpdated: (id) => set(state => ({
        features: state.features.map(feature => 
          feature.id === id 
            ? { ...feature, lastUpdated: 'Just now' } 
            : feature
        )
      })),
    }),
    {
      name: 'sentinel-protection-store',
    }
  )
);

// Function to update times every minute
export const startTimeUpdater = () => {
  const updateTimes = () => {
    const features = useProtectionStore.getState().features;
    
    features.forEach(feature => {
      if (feature.lastUpdated !== 'Just now') {
        const timeParts = feature.lastUpdated.split(' ');
        if (timeParts.length >= 2) {
          const value = parseInt(timeParts[0]);
          const unit = timeParts[1];
          
          // Increment the time
          if (unit.includes('minute')) {
            const newValue = value + 1;
            if (newValue < 60) {
              useProtectionStore.getState().features.find(f => f.id === feature.id)!.lastUpdated = 
                `${newValue} ${newValue === 1 ? 'minute' : 'minutes'} ago`;
            } else {
              useProtectionStore.getState().features.find(f => f.id === feature.id)!.lastUpdated = 
                '1 hour ago';
            }
          } else if (unit.includes('hour')) {
            const newValue = value + 1;
            useProtectionStore.getState().features.find(f => f.id === feature.id)!.lastUpdated = 
              `${newValue} ${newValue === 1 ? 'hour' : 'hours'} ago`;
          }
        }
      } else {
        // Change "Just now" to "1 minute ago" after a minute
        useProtectionStore.getState().features.find(f => f.id === feature.id)!.lastUpdated = 
          '1 minute ago';
      }
    });
  };
  
  // Update every minute
  const interval = setInterval(updateTimes, 60000);
  
  // Return a cleanup function
  return () => clearInterval(interval);
};
