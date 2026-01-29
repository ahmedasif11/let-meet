import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import {
  Camera,
  User,
  Palette,
  Sparkles,
  X,
  Settings,
  Download,
  Upload,
} from 'lucide-react';
import { VirtualBackgroundsPanelProps, BackgroundOption } from './types';
import { colorBackgrounds, imageBackgrounds } from './data';
import {
  createCustomColorBackground,
  createBlurBackground,
  createNoneBackground,
} from './utils';

export function VirtualBackgroundsPanel({
  isOpen,
  onClose,
  onBackgroundChange,
  currentBackground,
}: VirtualBackgroundsPanelProps) {
  const [blurAmount, setBlurAmount] = useState(
    currentBackground.blurAmount || 50
  );
  const [customColor, setCustomColor] = useState('#4f46e5');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const noneBackground = createNoneBackground();
  const blurBackground = createBlurBackground(blurAmount);

  const handleBackgroundSelect = (background: BackgroundOption) => {
    if (background.type === 'blur') {
      background.blurAmount = blurAmount;
    }
    onBackgroundChange(background);
  };

  const handleBlurChange = (value: number[]) => {
    const newBlur = value[0];
    setBlurAmount(newBlur);
    if (currentBackground.type === 'blur') {
      onBackgroundChange({
        ...currentBackground,
        blurAmount: newBlur,
      });
    }
  };

  const handleCreateCustomColor = () => {
    const customBackground = createCustomColorBackground(customColor);
    onBackgroundChange(customBackground);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:w-96 max-w-full bg-card backdrop-blur-xl border-border overflow-hidden"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Virtual Backgrounds
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-6 pr-2">
          {/* Quick Settings */}
          <div className="flex items-center justify-between">
            <Label htmlFor="advanced-mode">
              Advanced Mode
            </Label>
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
          </div>

          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="presets" className="text-xs">
                Presets
              </TabsTrigger>
              <TabsTrigger value="images" className="text-xs">
                Images
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs">
                Custom
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              {/* None Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBackgroundSelect(noneBackground)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  currentBackground.type === 'none'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">No Background</h4>
                      <p className="text-muted-foreground text-sm">Show your real background</p>
                    </div>
                  </div>
                {currentBackground.type === 'none' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
                )}
              </motion.div>

              {/* Blur Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBackgroundSelect(blurBackground)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  currentBackground.type === 'blur'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Blur Background</h4>
                    <p className="text-muted-foreground text-sm">Blur your background</p>
                  </div>
                </div>
                {currentBackground.type === 'blur' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
                )}
              </motion.div>

              {/* Blur Amount Slider */}
              {(currentBackground.type === 'blur' || isAdvancedMode) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label className="text-sm">
                    Blur Amount: {blurAmount}%
                  </Label>
                  <Slider
                    value={[blurAmount]}
                    onValueChange={handleBlurChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </motion.div>
              )}

              {/* Color Backgrounds */}
              <div className="space-y-3">
                <h4 className="font-medium">Color Backgrounds</h4>
                <div className="grid grid-cols-2 gap-3">
                  {colorBackgrounds.map((bg) => (
                    <motion.div
                      key={bg.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBackgroundSelect(bg)}
                      className={`relative aspect-video rounded-lg cursor-pointer border-2 overflow-hidden ${
                        currentBackground.id === bg.id ? 'border-primary' : 'border-border hover:border-muted-foreground/50'
                      }`}
                      style={{ background: bg.value }}
                    >
                      {currentBackground.id === bg.id && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                        <p className="text-white text-xs">{bg.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {imageBackgrounds.map((bg) => (
                  <motion.div
                    key={bg.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBackgroundSelect(bg)}
                    className={`relative aspect-video rounded-lg cursor-pointer border-2 overflow-hidden ${
                      currentBackground.id === bg.id ? 'border-primary' : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <ImageWithFallback
                      src={bg.thumbnail || bg.value || ''}
                      alt={bg.name}
                      className="w-full h-full object-cover"
                    />
                    {bg.isPremium && (
                      <Badge className="absolute top-1 left-1 bg-yellow-600 text-xs">
                        Premium
                      </Badge>
                    )}
                    {currentBackground.id === bg.id && (
                      <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                      <p className="text-white text-xs">{bg.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Upload Custom Image */}
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Custom Image
              </Button>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-3">
                <Label>Custom Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border border-border bg-transparent cursor-pointer"
                  />
                  <Button onClick={handleCreateCustomColor} className="flex-1" variant="secondary">
                    <Palette className="w-4 h-4 mr-2" />
                    Apply Color
                  </Button>
                </div>
              </div>

              {/* Advanced Settings */}
              {isAdvancedMode && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Advanced Settings
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Edge Smoothing</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>Background Opacity</Label>
                      <Slider
                        defaultValue={[100]}
                        max={100}
                        min={50}
                        step={5}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Motion Blur</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Current Setup
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
