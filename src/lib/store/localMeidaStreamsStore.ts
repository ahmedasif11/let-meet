let localMediaStreams: MediaStream[] = [];

const localMediaStreamsStore = {
  getLocalMediaStreams: () => localMediaStreams,
  setLocalMediaStreams: (streams: MediaStream[]) => {
    localMediaStreams = streams;
  },
};

export default localMediaStreamsStore;
