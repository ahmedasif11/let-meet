import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing?: boolean;
  connectionQuality: 'good' | 'poor' | 'disconnected';
  isHandRaised?: boolean;
  isSpeaking?: boolean;
  isHost?: boolean;
  isYou?: boolean;
  joinedAt: string;
}

interface ParticipantState {
  participants: Participant[];
}

const initialState: ParticipantState = {
  participants: [],
};

const participantSlice = createSlice({
  name: 'participant',
  initialState,
  reducers: {
    addParticipants(state, action: PayloadAction<Participant[]>) {
      state.participants = action.payload;
    },

    addParticipant(state, action: PayloadAction<Participant>) {
      state.participants.push(action.payload);
    },

    removeParticipant(state, action: PayloadAction<string>) {
      state.participants = state.participants.filter(
        (p) => p.id !== action.payload
      );
    },

    updateParticipant(
      state,
      action: PayloadAction<{ id: string; data: Partial<Participant> }>
    ) {
      const index = state.participants.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.participants[index] = {
          ...state.participants[index],
          ...action.payload.data,
        };
      }
    },

    clearParticipants(state) {
      state.participants = [];
    },
  },
});

export const {
  addParticipants,
  addParticipant,
  removeParticipant,
  updateParticipant,
  clearParticipants,
} = participantSlice.actions;

export default participantSlice.reducer;
