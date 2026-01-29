import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  Headphones,
  Mic,
  Volume2,
  Settings,
  Zap,
  ShieldCheck,
  Waves,
  Music,
  Monitor,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Ear,
  MicOff,
  VolumeX,
  Brain,
  Wind,
  Play,
  Pause,
} from 'lucide-react';
import { AdvancedAudioControlsProps } from './types';
import { getQualityColor, getTestIcon, resetToDefaults } from './utils';
import { useAudioSettings } from './hooks/useAudioSettings';

export function AdvancedAudioControls({
  isOpen,
  onClose,
  onSettingsChange,
}: AdvancedAudioControlsProps) {
  const {
    settings,
    audioLevels,
    processingStats,
    testMode,
    isProcessingTest,
    updateSetting,
    runAudioTest,
    resetToDefaults: handleResetToDefaults,
  } = useAudioSettings(onSettingsChange);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:w-[480px] max-w-full bg-card backdrop-blur-xl border-border overflow-hidden"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            Advanced Audio Controls
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 pr-2">
          <Tabs defaultValue="enhancement" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="enhancement">Enhancement</TabsTrigger>
              <TabsTrigger value="levels">Levels</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="enhancement" className="space-y-4 mt-4">
              {/* Audio Processing Features */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Audio Processing
                  </CardTitle>
                  <CardDescription>
                    Advanced audio enhancement powered by machine learning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Noise Suppression
                      </Label>
                      <Switch
                        checked={settings.noiseSuppression}
                        onCheckedChange={(checked: boolean) =>
                          updateSetting('noiseSuppression', checked)
                        }
                      />
                    </div>
                    {settings.noiseSuppression && (
                      <div className="ml-6 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Suppression Level: {settings.noiseSuppressionLevel}%
                        </Label>
                        <Slider
                          value={[settings.noiseSuppressionLevel]}
                          onValueChange={([value]: number[]) =>
                            updateSetting('noiseSuppressionLevel', value)
                          }
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Waves className="w-4 h-4" />
                        Echo Cancellation
                      </Label>
                      <Switch
                        checked={settings.echoCancellation}
                        onCheckedChange={(checked: boolean) =>
                          updateSetting('echoCancellation', checked)
                        }
                      />
                    </div>
                    {settings.echoCancellation && (
                      <div className="ml-6 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Cancellation Level: {settings.echoCancellationLevel}%
                        </Label>
                        <Slider
                          value={[settings.echoCancellationLevel]}
                          onValueChange={([value]: number[]) =>
                            updateSetting('echoCancellationLevel', value)
                          }
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Auto Gain Control
                      </Label>
                      <Switch
                        checked={settings.autoGainControl}
                        onCheckedChange={(checked: boolean) =>
                          updateSetting('autoGainControl', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Wind className="w-4 h-4" />
                        High-Pass Filter
                      </Label>
                      <Switch
                        checked={settings.highPassFilter}
                        onCheckedChange={(checked: boolean) =>
                          updateSetting('highPassFilter', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Ear className="w-4 h-4" />
                        Voice Enhancement
                      </Label>
                      <Switch
                        checked={settings.voiceEnhancement}
                        onCheckedChange={(checked: boolean) =>
                          updateSetting('voiceEnhancement', checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        Music Mode
                      </Label>
                      <Switch
                        checked={settings.musicMode}
                        onCheckedChange={(checked: boolean) =>
                          updateSetting('musicMode', checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audio Quality Settings */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Quality Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Sample Rate</Label>
                    <Select
                      value={settings.sampleRate.toString()}
                      onValueChange={(value: string) =>
                        updateSetting('sampleRate', parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16000">16 kHz (Voice)</SelectItem>
                        <SelectItem value="44100">
                          44.1 kHz (CD Quality)
                        </SelectItem>
                        <SelectItem value="48000">
                          48 kHz (Professional)
                        </SelectItem>
                        <SelectItem value="96000">
                          96 kHz (High Definition)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Bitrate</Label>
                    <Select
                      value={settings.bitrate.toString()}
                      onValueChange={(value: string) =>
                        updateSetting('bitrate', parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64">64 kbps (Low)</SelectItem>
                        <SelectItem value="128">128 kbps (Standard)</SelectItem>
                        <SelectItem value="256">256 kbps (High)</SelectItem>
                        <SelectItem value="320">320 kbps (Maximum)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Stats */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Processing Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Audio Latency</span>
                    <Badge variant="secondary">
                      {processingStats.latency}ms
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CPU Usage</span>
                    <Badge variant="secondary">
                      {processingStats.cpuUsage}%
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Audio Quality</span>
                    <Badge
                      variant={
                        processingStats.quality >= 90 ? 'default' : 'secondary'
                      }
                      className={getQualityColor(processingStats.quality)}
                    >
                      {processingStats.quality}/100
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="levels" className="space-y-4 mt-4">
              {/* Input Volume */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Input Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Input Volume: {settings.inputVolume}%
                    </Label>
                    <Slider
                      value={[settings.inputVolume]}
                      onValueChange={([value]: number[]) =>
                        updateSetting('inputVolume', value)
                      }
                      max={100}
                      min={0}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Input Level</Label>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={audioLevels.input}
                        className="flex-1 h-3"
                      />
                      <span className="text-muted-foreground text-sm w-12">
                        {Math.round(audioLevels.input)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Noise Level</Label>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={audioLevels.noise}
                        className="flex-1 h-3"
                      />
                      <span className="text-muted-foreground text-sm w-12">
                        {Math.round(audioLevels.noise)}%
                      </span>
                    </div>
                    {audioLevels.noise > 50 && !settings.noiseSuppression && (
                      <div className="flex items-center gap-2 text-yellow-500 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>
                          High noise detected. Consider enabling noise
                          suppression.
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Output Volume */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Output Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Output Volume: {settings.outputVolume}%
                    </Label>
                    <Slider
                      value={[settings.outputVolume]}
                      onValueChange={([value]: number[]) =>
                        updateSetting('outputVolume', value)
                      }
                      max={100}
                      min={0}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Output Level</Label>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={audioLevels.output}
                        className="flex-1 h-3"
                      />
                      <span className="text-muted-foreground text-sm w-12">
                        {Math.round(audioLevels.output)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Audio Visualization */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white">Audio Waveform</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-muted/50 rounded-lg flex items-end justify-center gap-1 p-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-blue-500 w-2 rounded-t"
                        animate={{
                          height: `${Math.random() * 60 + 10}%`,
                        }}
                        transition={{
                          duration: 0.1,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4 mt-4">
              {/* Audio Device Tests */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white">Device Testing</CardTitle>
                  <CardDescription>
                    Test your audio devices to ensure optimal performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runAudioTest('microphone')}
                    disabled={isProcessingTest}
                  >
                    {getTestIcon(testMode, isProcessingTest) === 'Settings' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Settings className="w-4 h-4" />
                      </motion.div>
                    )}
                    {getTestIcon(testMode, isProcessingTest) ===
                      'CheckCircle' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {getTestIcon(testMode, isProcessingTest) === 'Play' && (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Test Microphone</span>
                    {testMode === 'microphone' && !isProcessingTest && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runAudioTest('speaker')}
                    disabled={isProcessingTest}
                  >
                    {getTestIcon(testMode, isProcessingTest) === 'Settings' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Settings className="w-4 h-4" />
                      </motion.div>
                    )}
                    {getTestIcon(testMode, isProcessingTest) ===
                      'CheckCircle' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {getTestIcon(testMode, isProcessingTest) === 'Play' && (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Test Speakers</span>
                    {testMode === 'speaker' && !isProcessingTest && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => runAudioTest('echo')}
                    disabled={isProcessingTest}
                  >
                    {getTestIcon(testMode, isProcessingTest) === 'Settings' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Settings className="w-4 h-4" />
                      </motion.div>
                    )}
                    {getTestIcon(testMode, isProcessingTest) ===
                      'CheckCircle' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {getTestIcon(testMode, isProcessingTest) === 'Play' && (
                      <Play className="w-4 h-4" />
                    )}
                    <span>Test Echo Cancellation</span>
                    {testMode === 'echo' && !isProcessingTest && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Test Results */}
              {testMode !== 'none' && (
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    {isProcessingTest ? (
                      <div className="text-center py-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-8 h-8 mx-auto mb-2"
                        >
                          <Settings className="w-8 h-8 text-blue-500" />
                        </motion.div>
                        <p className="text-white">Testing {testMode}...</p>
                        <p className="text-gray-400 text-sm">
                          Please wait while we analyze your audio setup
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-white">{testMode} test completed</p>
                        <p className="text-gray-400 text-sm">
                          Your {testMode} is working correctly
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Reset Settings */}
              <Button
                variant="outline"
                onClick={handleResetToDefaults}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
