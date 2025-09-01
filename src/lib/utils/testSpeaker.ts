export async function testSpeaker({
  volume,
  sound,
}: {
  volume: number;
  sound: HTMLAudioElement;
}) {
  sound.volume = volume / 100;

  try {
    // Play the audio
    await sound.play();
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}
