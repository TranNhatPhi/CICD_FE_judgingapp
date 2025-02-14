// create an auth slice that will handle the authentication state of the user

import { createSlice } from "@reduxjs/toolkit";

import { getProjectListJudge } from "./api";
import { TProjectState } from "./entity";

const initialState: TProjectState = {
  projects: [],
  error: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(getProjectListJudge.matchFulfilled, (state, action) => {
      state.projects = action.payload;
    });
    builder.addMatcher(getProjectListJudge.matchRejected, (state) => {
      state.projects = [];
    });
  },
});
