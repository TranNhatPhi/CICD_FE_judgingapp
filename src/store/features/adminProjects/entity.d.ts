import { Omit } from "lodash";

import { TSemester } from "~/entities";

export interface TProjectAdmin {
  id: number;
  title: string;
  description: string;
  client: string;
  averageMarkV1: number;
  averageMarkV2: number;
  semester: TSemester;
  totalNumberOfJudges: number;
  groupName: string;
  rank?: string | null;
}

export type TProjectAdminState = {
  projects: TProjectAdmin[];
  error: string | null;
  config: {
    eventName: string;
    description: string;
    round1Closed: boolean;
    round2Closed: boolean;
  };
};

export type MarkingWebsocketState = {
  round1: boolean;
};

export interface TJudge {
  id: number;
  account: string;
  pwd: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  numberOfProject: number;
}

export interface TJudgeWithMarked {
  id: number;
  account: string;
  pwd: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  numberOfProject: number;
  mark: number;
}

export interface TProjectRound1 {
  projectId: number;
  groupName: string;
  title: string;
  numberOfJudges: number;
  judge: TJudge[];
  description?: string;
}

export interface TProjectRound1Result {
  project: TProjectAdmin;
  judgesAssigned: TJudge[];
  judgesMarked: TJudgeWithMarked[];
}

export type TProjectRound2Result = Omit<TProjectRound1Result, "judgesAssigned">;

export interface TSchool {
  id: number;
  schoolName: string;
  description: string | null;
}

export interface TSemester {
  id: number;
  semesterName: string;
  yearSemester: number;
  totalNumberOfProjects: number;
  school: TSchool;
}

export interface TProjectUpdateRequest {
  groupName: string;
  title: string;
  description: string;
  client: string;
}

export interface TCriteria {
  id: number;
  criteriaName: string;
  description: string;
  semester: TSemester;
}
