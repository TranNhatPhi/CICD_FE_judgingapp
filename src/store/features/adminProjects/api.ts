import { api } from "~/store/api";

import {
  TCriteria,
  TJudge,
  TProjectAdmin,
  TProjectAdminState,
  TProjectRound1,
  TProjectRound1Result,
  TProjectRound2Result,
  TProjectUpdateRequest,
  TSchool,
  TSemester,
} from "./entity";

const projectAdminApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProjectList: build.query({
      query: (semesterId?: string | null) => ({
        url: `projects/showAll/${semesterId}`,
      }),
      transformResponse: (responseData: { data: TProjectAdmin[] }) => {
        return responseData.data;
      },
    }),

    addProjects: build.mutation({
      query: ({ id, body }) => ({
        url: `projects/createProjects/${id}`,
        method: "POST",
        body: body,
      }),
    }),
    uploadProjects: build.mutation({
      query: ({ id, body }) => {
        return {
          url: `projects/import/${id}`,
          method: "POST",
          body,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
    }),
    updateProjectById: build.mutation({
      query: ({ id, ...body }: { id: string } & TProjectUpdateRequest) => ({
        url: `projects/update/${id}`,
        method: "PUT",
        body: body,
      }),
    }),
    removeProjectById: build.mutation({
      query: ({ id }: { id: string }) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
    }),

    getProjectRound1ToAllocate: build.query({
      query: (params) => ({
        url: "projects/assignedList",
        params,
      }),
      transformResponse: (responseData: { data: TProjectRound1[] }) => {
        return responseData.data;
      },
    }),

    getJudgeList: build.query({
      query: (id) => ({
        url: `users/showAll/${id}`,
      }),
      transformResponse: (responseData: { data: TJudge[] }) => {
        return responseData.data;
      },
    }),

    assignJudgesToProjects: build.mutation({
      query: ({ id, requests }) => ({
        url: `users/assignProject/${id}`,
        method: "PUT",
        body: requests,
      }),
      extraOptions: { maxRetries: 0 },
    }),
    removeUserAccount: build.mutation({
      query: (id) => ({
        url: `users/deleteAll?judgeId=${id}`,
        method: "DELETE",
      }),
    }),

    confirmProjectsToRound2: build.mutation({
      query: ({ id, body }) => ({
        url: `users/toRound2/${id}`,
        method: "PUT",
        body: [...body],
      }),
      extraOptions: { maxRetries: 0 },
    }),

    getRound1ListResult: build.query({
      query: (id) => ({
        url: `projects/judge-marks/${id}`,
      }),
      transformResponse: (responseData: TProjectRound1Result[]) => {
        return responseData;
      },
    }),
    getRound2ListResult: build.query({
      query: (id) => ({
        url: `projects/judge-marks-round2/${id}`,
      }),
      transformResponse: (responseData: TProjectRound2Result[]) => {
        return responseData;
      },
    }),
    assignWinners: build.mutation({
      query: ({ id, body }) => ({
        url: `projects/chooseRank/${id}`,
        method: "POST",
        body,
      }),
    }),
    getSemesterList: build.query({
      query: (id) => ({
        url: `semesters/all/${id}`,
      }),
      transformResponse: (responseData: { data: TSemester[] }) => {
        return responseData.data;
      },
    }),
    getSchoolList: build.query({
      query: () => ({
        url: "schools/all",
      }),
      transformResponse: (responseData: { data: TSchool[] }) => {
        return responseData.data;
      },
    }),
    addSchool: build.mutation({
      query: (body: { schoolName: string }) => ({
        url: "schools/create",
        method: "POST",
        body,
      }),
    }),
    addSemester: build.mutation({
      query: (body: {
        semesterName: string;
        schoolId: number;
        yearSemester: string;
        eventName: string;
        description?: string;
      }) => ({
        url: `semesters/${body.schoolId}`,
        method: "POST",
        body: {
          semesterName: body.semesterName,
          yearSemester: Number(body.yearSemester),
          eventName: body.eventName,
          description: body?.description ?? "",
        },
      }),
    }),
    getRound1JudgeList: build.query({
      query: (semesterId?: string | null) => ({
        url: `users/JudgesListProjects/${semesterId}`,
      }),
      transformResponse: (responseData: {
        data: {
          judge: TJudge;
          numberOfProjects: number;
          projects: TProjectAdmin[];
        }[];
      }) => {
        return responseData.data;
      },
    }),
    createJudgeAccount: build.mutation({
      query: ({ id, body }) => ({
        url: `users/create/${id}`,
        method: "POST",
        body,
      }),
    }),
    updateJudgeAccount: build.mutation({
      query: ({ id, body }) => ({
        url: `users/edit?judgeId=${id}`,
        method: "POST",
        body,
      }),
    }),

    getConfig: build.query({
      query: () => ({
        url: "users/config",
      }),
      transformResponse: (responseData: {
        data: TProjectAdminState["config"];
      }) => {
        return responseData.data;
      },
    }),

    getConfigBySemesterId: build.query({
      query: (id: string) => ({
        url: `admin/config/${id}`,
      }),
      transformResponse: (responseData: {
        data: { round1Closed: boolean; round2Closed: boolean };
      }) => {
        return responseData.data;
      },
    }),
    downloadExcelFile: build.mutation({
      query(args) {
        return {
          url: `users/export/${args.setupId}`,
          method: "GET",
          responseHandler: async (response) => {
            try {
              window.location.assign(
                window.URL.createObjectURL(await response.blob()),
              );
            } catch (error) {
              return error;
            }
          },
          cache: "no-cache",
        };
      },
    }),
    exportFileWinners: build.mutation({
      query(args) {
        return {
          url: `projects/export/${args.semesterId}`,
          method: "GET",
          responseHandler: async (response) => {
            try {
              window.location.assign(
                window.URL.createObjectURL(await response.blob()),
              );
            } catch (error) {
              return error;
            }
          },
          cache: "no-cache",
        };
      },
    }),
    getCriteriaList: build.query({
      query: (id) => ({
        url: `criteria/showAllCriteria/${id}`,
      }),
      transformResponse: (responseData: { data: TCriteria[] }) => {
        return responseData.data;
      },
    }),
    addCriteria: build.mutation({
      query: ({ id, body }) => ({
        url: `criteria/createCriteria/${id}`,
        method: "POST",
        body,
      }),
    }),
    updateCriteria: build.mutation({
      query: ({ id, body }) => ({
        url: `criteria/editCriteria?criteriaId=${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteCriteria: build.mutation({
      query: ({ id, body }) => ({
        url: `criteria/deleteCriteria?criteriaId=${id}`,
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const { getProjectList, addProjects, getConfig } =
  projectAdminApi.endpoints;
export const {
  useGetProjectListQuery,
  useAddProjectsMutation,
  useGetProjectRound1ToAllocateQuery,
  useGetJudgeListQuery,
  useAssignJudgesToProjectsMutation,
  useGetRound1ListResultQuery,
  useGetSemesterListQuery,
  useGetSchoolListQuery,
  useGetRound1JudgeListQuery,
  useUpdateProjectByIdMutation,
  useRemoveProjectByIdMutation,
  useCreateJudgeAccountMutation,
  useDownloadExcelFileMutation,
  useUpdateJudgeAccountMutation,
  useAddSchoolMutation,
  useAddSemesterMutation,
  useGetRound2ListResultQuery,
  useGetCriteriaListQuery,
  useDeleteCriteriaMutation,
  useUpdateCriteriaMutation,
  useAddCriteriaMutation,
  useConfirmProjectsToRound2Mutation,
  useAssignWinnersMutation,
  useRemoveUserAccountMutation,
  useUploadProjectsMutation,
  useGetConfigQuery,
  useGetConfigBySemesterIdQuery,
  useExportFileWinnersMutation,
} = projectAdminApi;
