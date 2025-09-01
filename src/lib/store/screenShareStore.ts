let screenSharing = false;
const subscribers: ((state: boolean) => void)[] = [];

const screenShareStateStore = {
  isScreenSharing: () => screenSharing,
  setScreenSharing: (state: boolean) => {
    screenSharing = state;
    subscribers?.forEach((fn) => fn(screenSharing));
  },
  subscribe: (fn: (state: boolean) => void) => {
    subscribers?.push(fn);
    fn(screenSharing);
  },
  unsubscribe: (fn: (state: boolean) => void) => {
    const index = subscribers?.indexOf(fn);
    if (index !== -1) subscribers?.splice(index, 1);
  },
};

export default screenShareStateStore;
