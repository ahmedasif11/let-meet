const remoteStreams: { [key: string]: MediaStream } = {};

let listeners: ((streams: { [key: string]: MediaStream }) => void)[] = [];

const remoteStreamsStore = {
  addStream: (stream: MediaStream, socketId: string) => {
    if (!stream || !socketId) return;

    if (remoteStreams[socketId] !== stream) {
      console.log(
        `[RemoteStreamsStore] Adding stream for socketId: ${socketId}`,
        stream
      );
      remoteStreams[socketId] = stream;
      remoteStreamsStore.notifyListeners();
    }
  },

  getStream: (socketId: string) => {
    return remoteStreams[socketId] || null;
  },

  getAllStreams: () => {
    return { ...remoteStreams };
  },

  removeStream: (socketId: string) => {
    if (remoteStreams[socketId]) {
      remoteStreams[socketId].getTracks().forEach((track) => track.stop());
      delete remoteStreams[socketId];
      remoteStreamsStore.notifyListeners();
    }
  },

  subscribe: (callback: (streams: { [key: string]: MediaStream }) => void) => {
    listeners.push(callback);
    callback({ ...remoteStreams });
  },

  unsubscribe: (
    callback: (streams: { [key: string]: MediaStream }) => void
  ) => {
    listeners = listeners.filter((cb) => cb !== callback);
  },

  notifyListeners: () => {
    const shallowCopy = { ...remoteStreams };
    console.log(
      `[RemoteStreamsStore] Notifying ${listeners.length} listeners with streams:`,
      Object.keys(shallowCopy)
    );
    listeners.forEach((cb) => cb(shallowCopy));
  },
};

export default remoteStreamsStore;
