// create an auth slice that will handle the authentication state of the user

import { createSlice } from "@reduxjs/toolkit";

import { login } from "./api";
import { TAuthState } from "./entity";

const initialState: TAuthState = {
  token: null,
  error: null,
  userId: null,
  username: null,
  role: null,
  semesterId: null,
  schoolId: null,
  semesterName: null,
  schoolName: null,
  yearSemester: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.username = null;
      state.role = null;
      state.semesterId = null;
      state.schoolId = null;
      state.semesterName = null;
      state.schoolName = null;
      state.yearSemester = null;
    },
    setSchoolId: (state, action) => {
      state.schoolId = action.payload.id;
      state.schoolName = action.payload.schoolName;
    },
    setSemesterId: (state, action) => {
      state.semesterId = action.payload.id;
      state.semesterName = action.payload.semesterName;
      state.yearSemester = action.payload.yearSemester;
    },
    setAuth: (state, action) => {
      state.token = action.payload.jwt;
      state.userId = action.payload.id;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(login.matchFulfilled, (state, action) => {
      state.token = action.payload.jwt;
      state.userId = action.payload.id;
      state.username = action.payload.username;
      state.role = action.payload.role;
    });
    builder.addMatcher(login.matchRejected, (state) => {
      state.token = null;
    });
  },
});

export const {
  setToken,
  setError,
  logout,
  setSemesterId,
  setSchoolId,
  setAuth,
} = authSlice.actions;
