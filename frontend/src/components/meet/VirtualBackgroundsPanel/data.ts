import { BackgroundOption } from './types';

export const colorBackgrounds: BackgroundOption[] = [
  {
    id: 'blue',
    type: 'color',
    name: 'Ocean Blue',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'purple',
    type: 'color',
    name: 'Purple Haze',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'green',
    type: 'color',
    name: 'Forest Green',
    value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'orange',
    type: 'color',
    name: 'Sunset Orange',
    value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 'dark',
    type: 'color',
    name: 'Professional Dark',
    value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
  },
  {
    id: 'warm',
    type: 'color',
    name: 'Warm Gradient',
    value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
];

// Mock image backgrounds - in a real app, these would come from your backend
export const imageBackgrounds: BackgroundOption[] = [
  {
    id: 'office1',
    type: 'image',
    name: 'Modern Office',
    value:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop',
  },
  {
    id: 'living1',
    type: 'image',
    name: 'Cozy Living Room',
    value:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
  },
  {
    id: 'library1',
    type: 'image',
    name: 'Classic Library',
    value:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop',
  },
  {
    id: 'nature1',
    type: 'image',
    name: 'Peaceful Garden',
    value:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
  },
  {
    id: 'city1',
    type: 'image',
    name: 'City Skyline',
    value:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop',
    isPremium: true,
  },
  {
    id: 'space1',
    type: 'image',
    name: 'Space Station',
    value:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop',
    thumbnail:
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=150&fit=crop',
    isPremium: true,
  },
];
