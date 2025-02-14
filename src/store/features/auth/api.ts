import { api } from "~/store/api";

const authAPI = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { login } = authAPI.endpoints;
export const { useLoginMutation } = authAPI;
