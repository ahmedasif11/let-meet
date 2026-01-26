export interface VirtualBackgroundsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundChange: (background: BackgroundOption) => void;
  currentBackground: BackgroundOption;
}

export interface BackgroundOption {
  id: string;
  type: 'none' | 'blur' | 'image' | 'color';
  name: string;
  value?: string; // image URL or color value
  blurAmount?: number;
  thumbnail?: string;
  isPremium?: boolean;
}
