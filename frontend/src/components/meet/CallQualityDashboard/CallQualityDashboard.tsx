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
        className="w-96 bg-gray-900/95 backdrop-blur-xl border-gray-700"
      >
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Call Quality Dashboard
          </SheetTitle>
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStats}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportReport}
              className="text-gray-400 hover:text-white"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="network">Network</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Overall Quality Score */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Overall Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Overall</span>
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
                        <div className="text-xs text-gray-400">Video</div>
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
                        <div className="text-xs text-gray-400">Audio</div>
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
                        <div className="text-xs text-gray-400">Network</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call Statistics */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white">Call Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Duration</span>
                    <span className="text-white">
                      {formatDuration(callStats.duration)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Participants</span>
                    <span className="text-white">{callStats.participants}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bitrate</span>
                    <span className="text-white">
                      {formatBitrate(callStats.bitrate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Resolution</span>
                    <span className="text-white">{callStats.resolution}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">FPS</span>
                    <span className="text-white">{callStats.fps}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              {alerts.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white">Recent Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-2 p-2 bg-gray-700/30 rounded"
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
                          <p className="text-white text-sm">{alert.message}</p>
                          <p className="text-gray-400 text-xs">
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
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    Network Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Connection Type</span>
                    <span className="text-white">
                      {networkStats.connectionType}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Signal Strength</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-blue-500" />
                      <span className="text-white">
                        {networkStats.signalStrength}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Latency</span>
                      <span className="text-white">
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
                      <span className="text-gray-300">Jitter</span>
                      <span className="text-white">
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
                      <span className="text-gray-300">Packet Loss</span>
                      <span className="text-white">
                        {networkStats.packetLoss}%
                      </span>
                    </div>
                    <Progress
                      value={Math.max(0, 100 - networkStats.packetLoss * 10)}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bandwidth</span>
                    <span className="text-white">
                      {formatBitrate(networkStats.bandwidth)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-4">
              {/* Device Performance */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Device Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        CPU Usage
                      </span>
                      <span className="text-white">
                        {deviceStats.cpuUsage}%
                      </span>
                    </div>
                    <Progress value={deviceStats.cpuUsage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center gap-2">
                        <HardDrive className="w-4 h-4" />
                        Memory Usage
                      </span>
                      <span className="text-white">
                        {deviceStats.memoryUsage}%
                      </span>
                    </div>
                    <Progress value={deviceStats.memoryUsage} className="h-2" />
                  </div>

                  {deviceStats.gpuUsage && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">GPU Usage</span>
                        <span className="text-white">
                          {deviceStats.gpuUsage}%
                        </span>
                      </div>
                      <Progress value={deviceStats.gpuUsage} className="h-2" />
                    </div>
                  )}

                  {deviceStats.batteryLevel && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        Battery
                      </span>
                      <span className="text-white">
                        {deviceStats.batteryLevel}%
                      </span>
                    </div>
                  )}

                  {deviceStats.temperature && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        Temperature
                      </span>
                      <span className="text-white">
                        {deviceStats.temperature}°C
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white">
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Latency Trend</span>
                      <div className="flex items-center gap-1">
                        {performanceData[performanceData.length - 1].latency >
                        performanceData[performanceData.length - 2].latency ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-white text-sm">
                          {performanceData[performanceData.length - 1].latency}
                          ms
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Bitrate Trend</span>
                      <div className="flex items-center gap-1">
                        {performanceData[performanceData.length - 1].bitrate >
                        performanceData[performanceData.length - 2].bitrate ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-white text-sm">
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
