import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Activity,
  Wifi,
  Cpu,
  HardDrive,
  Battery,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Download,
  Settings,
} from 'lucide-react';
import { CallQualityDashboardProps } from './types';
import {
  assessQuality,
  formatBitrate,
  formatDuration,
  getQualityColor,
  getSignalStrengthIcon,
} from './utils';
import {
  mockCallStats,
  mockNetworkStats,
  mockDeviceStats,
  mockPerformanceData,
  mockAlerts,
} from './mockData';

export function CallQualityDashboard({
  isOpen,
  onClose,
  callStats = mockCallStats,
  networkStats = mockNetworkStats,
  deviceStats = mockDeviceStats,
}: CallQualityDashboardProps) {
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const qualityMetrics = assessQuality(networkStats, callStats, deviceStats);

  const refreshStats = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      callStats,
      networkStats,
      deviceStats,
      qualityMetrics,
      alerts,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-quality-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:w-96 max-w-full bg-card backdrop-blur-xl border-border overflow-hidden"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Call Quality Dashboard
          </SheetTitle>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStats}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportReport}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 pr-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Overall Quality Score */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Overall Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Overall</span>
                      <Badge
                        className={`${getQualityColor(qualityMetrics.overall)} bg-transparent border`}
                      >
                        {qualityMetrics.overall}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${getQualityColor(qualityMetrics.video)}`}
                        >
                          {qualityMetrics.video === 'excellent'
                            ? 'A'
                            : qualityMetrics.video === 'good'
                              ? 'B'
                              : qualityMetrics.video === 'fair'
                                ? 'C'
                                : 'D'}
                        </div>
                        <div className="text-xs text-muted-foreground">Video</div>
                      </div>

                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${getQualityColor(qualityMetrics.audio)}`}
                        >
                          {qualityMetrics.audio === 'excellent'
                            ? 'A'
                            : qualityMetrics.audio === 'good'
                              ? 'B'
                              : qualityMetrics.audio === 'fair'
                                ? 'C'
                                : 'D'}
                        </div>
                        <div className="text-xs text-muted-foreground">Audio</div>
                      </div>

                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${getQualityColor(qualityMetrics.network)}`}
                        >
                          {qualityMetrics.network === 'excellent'
                            ? 'A'
                            : qualityMetrics.network === 'good'
                              ? 'B'
                              : qualityMetrics.network === 'fair'
                                ? 'C'
                                : 'D'}
                        </div>
                        <div className="text-xs text-muted-foreground">Network</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call Statistics */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground">Call Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground">
                      {formatDuration(callStats.duration)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="text-foreground">{callStats.participants}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bitrate</span>
                    <span className="text-foreground">
                      {formatBitrate(callStats.bitrate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="text-foreground">{callStats.resolution}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">FPS</span>
                    <span className="text-foreground">{callStats.fps}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              {alerts.length > 0 && (
                <Card className="bg-muted/50 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-foreground">Recent Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-2 p-2 bg-muted/50 rounded"
                      >
                        {alert.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        )}
                        {alert.type === 'error' && (
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        )}
                        {alert.type === 'info' && (
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-foreground text-sm">{alert.message}</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="network" className="space-y-4 mt-4">
              {/* Network Statistics */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Network Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Connection Type</span>
                    <span className="text-foreground">
                      {networkStats.connectionType}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Signal Strength</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-blue-500" />
                      <span className="text-foreground">
                        {networkStats.signalStrength}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="text-foreground">
                        {networkStats.latency}ms
                      </span>
                    </div>
                    <Progress
                      value={Math.max(0, 100 - networkStats.latency / 2)}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Jitter</span>
                      <span className="text-foreground">
                        {networkStats.jitter}ms
                      </span>
                    </div>
                    <Progress
                      value={Math.max(0, 100 - networkStats.jitter * 2)}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Packet Loss</span>
                      <span className="text-foreground">
                        {networkStats.packetLoss}%
                      </span>
                    </div>
                    <Progress
                      value={Math.max(0, 100 - networkStats.packetLoss * 10)}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bandwidth</span>
                    <span className="text-foreground">
                      {formatBitrate(networkStats.bandwidth)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-4">
              {/* Device Performance */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Device Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        CPU Usage
                      </span>
                      <span className="text-foreground">
                        {deviceStats.cpuUsage}%
                      </span>
                    </div>
                    <Progress value={deviceStats.cpuUsage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <HardDrive className="w-4 h-4" />
                        Memory Usage
                      </span>
                      <span className="text-foreground">
                        {deviceStats.memoryUsage}%
                      </span>
                    </div>
                    <Progress value={deviceStats.memoryUsage} className="h-2" />
                  </div>

                  {deviceStats.gpuUsage && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">GPU Usage</span>
                        <span className="text-foreground">
                          {deviceStats.gpuUsage}%
                        </span>
                      </div>
                      <Progress value={deviceStats.gpuUsage} className="h-2" />
                    </div>
                  )}

                  {deviceStats.batteryLevel && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        Battery
                      </span>
                      <span className="text-foreground">
                        {deviceStats.batteryLevel}%
                      </span>
                    </div>
                  )}

                  {deviceStats.temperature && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        Temperature
                      </span>
                      <span className="text-foreground">
                        {deviceStats.temperature}°C
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground">
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Latency Trend</span>
                      <div className="flex items-center gap-1">
                        {performanceData[performanceData.length - 1].latency >
                        performanceData[performanceData.length - 2].latency ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-foreground text-sm">
                          {performanceData[performanceData.length - 1].latency}
                          ms
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Bitrate Trend</span>
                      <div className="flex items-center gap-1">
                        {performanceData[performanceData.length - 1].bitrate >
                        performanceData[performanceData.length - 2].bitrate ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-foreground text-sm">
                          {formatBitrate(
                            performanceData[performanceData.length - 1].bitrate
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
