let cameraEnabled = true;
const subscribers: ((enabled: boolean) => void)[] = [];

const cameraStateChangeStore = {
  getCameraEnabled: () => cameraEnabled,
  setCameraEnabled: (enabled: boolean) => {
    cameraEnabled = enabled;
    subscribers.forEach((fn) => fn(cameraEnabled));
  },
  subscribe: (fn: (enabled: boolean) => void) => {
    subscribers.push(fn);
  },
  unsubscribe: (fn: (enabled: boolean) => void) => {
    const index = subscribers.indexOf(fn);
    if (index !== -1) subscribers.splice(index, 1);
  },
};

export default cameraStateChangeStore;
