import { api } from "~/store/api";

import {
  TCriteria,
  TProject,
  TProjectRound1,
  TRound1MarkRequest,
} from "./entity";

const projectApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjectListJudge: build.query({
      query: () => ({
        url: "projects/showAll",
      }),
      transformResponse: (responseData: { data: TProject[] }) => {
        return responseData.data;
      },
    }),
    getAllocedProjects: build.query({
      query: (id: string) => ({
        url: `marking/assigned/${id}`,
        params: {},
      }),
      transformResponse: (responseData: { data: TProjectRound1[] }) => {
        return responseData.data;
      },
    }),
    getRound2Projects: build.query({
      query: (id) => ({
        url: `projects/round2List?judgeId=${id}`,
      }),
      transformResponse: (
        responseData: {
          project: TProject;
          totalMark: number;
          markedBỵJudge?: boolean;
          comment?: string;
        }[],
      ) => {
        return responseData;
      },
    }),
    markRound1ByProjectId: build.mutation({
      query: ({ mark, ...data }: TRound1MarkRequest) => ({
        url: `marking/markRound1`,
        method: "PUT",
        body: [
          {
            ...data,
            criteriaMarks: mark,
          },
        ],
      }),
    }),
    markRound2ByProjectId: build.mutation({
      query: (data: {
        judgeId: number;
        projectMarks: { [key: string]: number };
        comment: string;
      }) => ({
        url: `marking/markRound2`,
        method: "PUT",
        body: [
          {
            ...data,
          },
        ],
      }),
    }),
    getCriteriaRound1: build.query({
      query: () => ({
        url: "criteria/showAllCriteria",
      }),
      transformResponse: (responseData: { data: TCriteria[] }) => {
        return responseData.data;
      },
    }),
  }),
});

export const { getProjectListJudge } = projectApi.endpoints;
export const {
  useGetProjectListJudgeQuery,
  useGetAllocedProjectsQuery,
  useGetRound2ProjectsQuery,
  useMarkRound1ByProjectIdMutation,
  useMarkRound2ByProjectIdMutation,
  useGetCriteriaRound1Query,
} = projectApi;
