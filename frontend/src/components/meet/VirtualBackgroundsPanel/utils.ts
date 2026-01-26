import { BackgroundOption } from './types';

export const createCustomColorBackground = (
  customColor: string
): BackgroundOption => {
  return {
    id: `custom-${Date.now()}`,
    type: 'color',
    name: 'Custom Color',
    value: customColor,
  };
};

export const createBlurBackground = (blurAmount: number): BackgroundOption => {
  return {
    id: 'blur',
    type: 'blur',
    name: 'Blur Background',
    blurAmount: blurAmount,
  };
};

export const createNoneBackground = (): BackgroundOption => {
  return {
    id: 'none',
    type: 'none',
    name: 'None',
  };
};
