import { TSemester } from "~/entities";

export interface TProject {
  id: number;
  groupName?: string; // FROM EVAN: (Showing Group Name in Round 2)
  title: string;
  description: string;
  client: string;
  averageMarkV1: number;
  averageMarkV2: number;
  semester: TSemester;
  totalNumberOfJudges: number;
  groupName: string;
  projectId?: number;
  projectTitle?: string;
  totalMark?: number;
  markedBỵJudge?: boolean;
}

export interface CriteriaMark {
  [key: string]: number;
}

export interface TProjectRound1 {
  projectId: number;
  groupName: string;
  projectTitle: string;
  criteriaMark: CriteriaMark;
  totalMark: number;
  markedBỵJudge: boolean;
  description?: string;
  comment?: string;
}

export type TProjectState = {
  projects: TProject[];
  error: string | null;
};

type TMarkCriteria = {
  [key: number]: number;
};

export type TRound1MarkRequest = {
  projectId: number;
  mark: { [key: number]: number };
  judgeId: number;
  comment?: string;
};

export interface TCriteria {
  id: number;
  criteriaName: string;
  description: string;
  semester: Semester;
}
