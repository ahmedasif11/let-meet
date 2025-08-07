let remoteStreams: { [key: string]: MediaStream } = {};

let listeners: ((streams: { [key: string]: MediaStream }) => void)[] = [];

const remoteStreamsStore = {
  addStream: (stream: MediaStream, socketId: string) => {
    remoteStreams[socketId] = stream;
    remoteStreamsStore.notifyListeners();
  },
  getStream: (socketId: string) => {
    return remoteStreams[socketId] || null;
  },
  getAllStreams: () => {
    return remoteStreams;
  },
  removeStream: (socketId: string) => {
    delete remoteStreams[socketId];
    remoteStreamsStore.notifyListeners();
  },
  subscribe: (callback: (streams: { [key: string]: MediaStream }) => void) => {
    listeners.push(callback);
  },
  unsubscribe: (
    callback: (streams: { [key: string]: MediaStream }) => void
  ) => {
    listeners = listeners.filter((cb) => cb !== callback);
  },
  notifyListeners: () => {
    listeners.forEach((cb) => cb(remoteStreams));
  },
};

export default remoteStreamsStore;
