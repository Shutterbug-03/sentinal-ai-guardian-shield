
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft, 
  Clock, 
  ShieldCheck,
  ShieldAlert, 
  ShieldX,
  Globe, 
  Lock, 
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Network,
  FolderLock,
  Activity,
  Cpu,
  Brain,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProtectionStore, startTimeUpdater } from "@/store/protectionStore";
import { useScanHistoryStore } from "@/store/scanHistoryStore";
import { evaluateSystemRisk, initializeThreatModel } from "@/utils/aiThreatDetection";
import { useToast } from "@/hooks/use-toast";

// Map for icon components
const iconComponents = {
  ShieldCheck,
  Globe,
  FolderLock,
  Network,
  Activity,
  UserCheck
};

export default function Protection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get protection features from store
  const { 
    features, 
    toggleFeature, 
    aiEnabled, 
    aiLearningMode, 
    toggleAI, 
    toggleAILearning, 
    setSystemStatus 
  } = useProtectionStore();
  
  // Get scan history for AI analysis
  const { scans } = useScanHistoryStore();
  
  // Initialize AI model
  useEffect(() => {
    const initAI = async () => {
      if (aiEnabled && scans.length > 0) {
        await initializeThreatModel(scans);
        toast({
          title: "AI Protection Initialized",
          description: "Threat detection model has been trained with your scan history.",
        });
      }
    };
    
    initAI();
    
    // Start time updater
    const cleanup = startTimeUpdater();
    return cleanup;
  }, [aiEnabled, scans, toast]);
  
  // Evaluate system risk using AI
  useEffect(() => {
    if (aiEnabled) {
      const { status } = evaluateSystemRisk(scans);
      setSystemStatus(status === 'safe' ? 'protected' : status as any);
    }
  }, [aiEnabled, scans, setSystemStatus]);
  
  // Get overall protection status
  const getProtectionStatus = () => {
    if (!aiEnabled) {
      const activeFeatures = features.filter(feature => feature.status === 'active');
      return activeFeatures.length === features.length ? 'protected' : 'at-risk';
    } else {
      // Use AI-based risk evaluation
      const { status } = evaluateSystemRisk(scans);
      return status === 'safe' ? 'protected' : status;
    }
  };
  
  const protectionStatus = getProtectionStatus();
  const inactiveFeatures = features.filter(feature => feature.status === 'inactive');
  
  const handleToggleProtectionFeature = (id: string) => {
    console.log(`Toggling protection feature: ${id}`);
    toggleFeature(id);
    
    if (id === 'real-time') {
      const feature = features.find(f => f.id === id);
      const newStatus = feature?.status === 'active' ? 'inactive' : 'active';
      
      toast({
        title: `Real-time Protection ${newStatus === 'active' ? 'Enabled' : 'Disabled'}`,
        description: newStatus === 'active' 
          ? "Your system is now actively protected against threats."
          : "Warning: Your system is vulnerable without real-time protection.",
        variant: newStatus === 'active' ? 'default' : 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header threatCount={0} />
      <main className="flex-1 container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Protection Features</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Protection Status Card */}
          <Card className={`col-span-full border-2 ${
            protectionStatus === 'protected' ? 'border-green-500' : 
            protectionStatus === 'at-risk' ? 'border-yellow-500' : 
            'border-red-500'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {protectionStatus === 'protected' ? (
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                ) : protectionStatus === 'at-risk' ? (
                  <ShieldAlert className="h-5 w-5 text-yellow-500" />
                ) : (
                  <ShieldX className="h-5 w-5 text-red-500" />
                )}
                Protection Status
              </CardTitle>
              <CardDescription>
                {protectionStatus === 'protected' 
                  ? "All protection features are active" 
                  : protectionStatus === 'at-risk'
                  ? `${inactiveFeatures.length} protection feature(s) inactive`
                  : "Critical security issue detected"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {protectionStatus === 'protected' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : protectionStatus === 'at-risk' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span>{
                    protectionStatus === 'protected' 
                      ? "Your system is fully protected" 
                      : protectionStatus === 'at-risk'
                      ? "Your system requires attention"
                      : "Immediate action required"
                  }</span>
                </div>
                <Button 
                  variant={protectionStatus === 'protected' ? "outline" : "default"} 
                  size="sm" 
                  onClick={() => {
                    // Enable all features
                    features.forEach(feature => {
                      if (feature.status === 'inactive') {
                        toggleFeature(feature.id);
                      }
                    });
                    
                    toast({
                      title: "Full Protection Enabled",
                      description: "All protection features have been activated.",
                    });
                  }}
                >
                  Enable All
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Protection Card */}
          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI-Powered Protection
              </CardTitle>
              <CardDescription>
                Enhanced protection using machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">AI Engine</div>
                      <div className="text-xs text-muted-foreground">
                        Uses machine learning to detect unknown threats
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={aiEnabled} 
                    onCheckedChange={() => {
                      toggleAI();
                      toast({
                        title: aiEnabled ? "AI Protection Disabled" : "AI Protection Enabled",
                        description: aiEnabled 
                          ? "Standard protection now active" 
                          : "Enhanced protection with machine learning active",
                      });
                    }} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Adaptive Learning</div>
                      <div className="text-xs text-muted-foreground">
                        Continuously improves detection based on your environment
                      </div>
                    </div>
                  </div>
                  <Switch 
                    checked={aiLearningMode} 
                    onCheckedChange={toggleAILearning}
                    disabled={!aiEnabled}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground mt-2">
                  {aiEnabled 
                    ? `AI protection is active with ${scans.length} scan(s) analyzed` 
                    : "Enable AI protection for enhanced security"}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Protection Features Cards */}
          {features.map(feature => {
            // Get the icon component
            const IconComponent = iconComponents[feature.icon as keyof typeof iconComponents] || ShieldCheck;
            
            return (
              <Card key={feature.id} className={feature.status === 'inactive' ? 'border-red-200' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <IconComponent className={`h-5 w-5 ${feature.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                    {feature.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span>Status:</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          feature.status === "active" 
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-red-500/20 text-red-500"
                        }`}>
                          {feature.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <Button 
                        variant={feature.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleProtectionFeature(feature.id)}
                      >
                        {feature.status === "active" ? "Disable" : "Enable"}
                      </Button>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {feature.lastUpdated}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
