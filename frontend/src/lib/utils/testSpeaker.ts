export const testSpeaker = ({
  volume,
  sound,
}: {
  volume: number;
  sound: HTMLAudioElement;
}) => {
  if (sound) {
    sound.volume = volume / 100;
    sound.currentTime = 0; // Reset to start
    sound.play().catch((error) => {
      console.error('Error playing test sound:', error);
    });
  }
};
