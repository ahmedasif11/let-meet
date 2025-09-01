export function monitorAudioLevel({
  stream,
  onLevelChange,
}: {
  stream: MediaStream;
  onLevelChange: (level: number) => void;
}) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyzer = audioContext.createAnalyser();

  analyzer.fftSize = 1024;

  const dataArray = new Uint8Array(analyzer.frequencyBinCount);
  source.connect(analyzer);

  let isRunning = true;

  const checkVolume = () => {
    if (!isRunning) return;

    analyzer.getByteFrequencyData(dataArray);
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    onLevelChange((average / 255) * 100);

    requestAnimationFrame(checkVolume);
  };

  checkVolume();

  return () => {
    isRunning = false;
    source.disconnect();
    analyzer.disconnect();
    audioContext.close();
  };
}
