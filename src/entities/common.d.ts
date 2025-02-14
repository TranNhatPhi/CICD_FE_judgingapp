// define common types here, which can be used in multiple places, like api response

import { ReactNode } from "react";

import { APIStatusCodes } from "~/constants";

export type TResponse<T> = {
  code: APIStatusCodes;
  message: string;
  data: T;
};

export type Nullable<T> = { [P in keyof T]: T[P] | null };

export type TChildrenProps = {
  children: ReactNode;
};

export interface TSemester {
  id: number;
  semesterName: string;
  yearSemester: number;
  totalNumberOfProjects: number;
}
