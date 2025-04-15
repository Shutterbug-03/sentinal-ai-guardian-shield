
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanSummary, Threat } from "@/utils/scannerUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AlertCircle, AlertTriangle, CheckCircle, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThreatReportProps {
  summary: ScanSummary;
  threats: Threat[];
  onBack?: () => void;
}

export function ThreatReport({ summary, threats, onBack }: ThreatReportProps) {
  // Format data for severity chart
  const severityData = [
    { name: "Critical", value: summary.threatsBySeverity.critical, color: "#ea384c" },
    { name: "High", value: summary.threatsBySeverity.high, color: "#f97316" },
    { name: "Medium", value: summary.threatsBySeverity.medium, color: "#eab308" },
    { name: "Low", value: summary.threatsBySeverity.low, color: "#84cc16" },
  ].filter(item => item.value > 0);
  
  // Format data for type chart
  const typeData = Object.entries(summary.threatsByType).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
    color: getRandomColor(key),
  }));
  
  // Get color based on threat type
  function getRandomColor(type: string) {
    const colorMap: Record<string, string> = {
      "trojan": "#ff6b6b",
      "adware": "#ffa86b",
      "spyware": "#ffc46b",
      "ransomware": "#ff6bcd",
      "rootkit": "#c46bff",
      "malware": "#6b9fff",
      "worm": "#6bffb8",
      "backdoor": "#b8ff6b", 
      "botnet": "#e7ff6b",
      "virus": "#ff8f6b"
    };
    
    return colorMap[type] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }
  
  const totalThreats = summary.threatsFound;
  
  function getSeverityIcon(severity: string) {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Threat Report</h2>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{summary.threatsFound}</div>
              <Shield className={`h-5 w-5 ${summary.threatsFound > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
            <p className="text-xs text-muted-foreground">
              From {summary.scannedFiles} scanned files
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{summary.threatsBySeverity.critical}</div>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.threatsBySeverity.critical > 0 ? 'Immediate action required' : 'No critical threats found'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scan Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{summary.scanDuration}s</div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.scannedFiles} files ({(summary.scannedFiles / Math.max(1, summary.scanDuration)).toFixed(2)} files/sec)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {totalThreats > 0 ? (
                  summary.threatsBySeverity.critical > 0 ? 'At Risk' : 'Warning'
                ) : 'Secure'}
              </div>
              {totalThreats > 0 ? (
                summary.threatsBySeverity.critical > 0 ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalThreats > 0 ? `${totalThreats} threats require attention` : 'No threats detected'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {severityData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Threats by Severity</CardTitle>
              <CardDescription>Distribution of threats based on severity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} threats`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
        
        {typeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Threats by Type</CardTitle>
              <CardDescription>Distribution of threats based on type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} threats`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Threat List */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Threats</CardTitle>
          <CardDescription>Detailed list of all detected threats</CardDescription>
        </CardHeader>
        <CardContent>
          {threats.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No threats detected
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-4 font-medium text-sm">Threat</th>
                    <th className="text-left py-2 px-4 font-medium text-sm hidden md:table-cell">Location</th>
                    <th className="text-left py-2 px-4 font-medium text-sm hidden sm:table-cell">Type</th>
                    <th className="text-left py-2 px-4 font-medium text-sm">Severity</th>
                    <th className="text-left py-2 px-4 font-medium text-sm hidden lg:table-cell">Detection Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {threats.map((threat, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(threat.severity)}
                          <span className="font-medium">{threat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{threat.filePath}</td>
                      <td className="py-3 px-4 text-sm hidden sm:table-cell">
                        <span className="capitalize">{threat.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          threat.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                          threat.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                          threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">{threat.detectionMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
