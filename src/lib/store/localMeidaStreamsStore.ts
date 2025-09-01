let localMediaStreams: MediaStream[] = [];

const localMediaStreamsStore = {
  getLocalMediaStreams: () => localMediaStreams,
  setLocalMediaStreams: (streams: MediaStream[]) => {
    localMediaStreams = streams;
  },
  clearLocalMediaStreams: () => {
    localMediaStreams = [];
  },
};

export default localMediaStreamsStore;
