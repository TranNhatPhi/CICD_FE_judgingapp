// create an auth slice that will handle the authentication state of the user

import { createSlice } from "@reduxjs/toolkit";

import { getConfig } from "./api";
import { MarkingWebsocketState, TProjectAdminState } from "./entity";

const initialState: TProjectAdminState = {
  projects: [],
  config: {
    eventName: "",
    description: "",
    round1Closed: false,
    round2Closed: false,
  },
  error: null,
};

const initialStateWs: MarkingWebsocketState = {
  round1: false,
};

export const adminProjectSlice = createSlice({
  name: "projectAdmin",
  initialState,
  reducers: {
    setAppConfig(state, action) {
      state.config = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(getConfig.matchFulfilled, (state, action) => {
      state.config = action.payload;
    });
  },
});

export const websocketSlice = createSlice({
  name: "websocket",
  initialState: initialStateWs,
  reducers: {
    setRound1(state, action) {
      state.round1 = action.payload;
    },
  },
});

export const { setAppConfig } = adminProjectSlice.actions;
export const { setRound1 } = websocketSlice.actions;
export default adminProjectSlice.reducer;
