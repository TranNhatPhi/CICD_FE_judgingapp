// useAppSelector to select token from auth slice

import { useAppDispatch, useAppSelector } from "~/store/hook";

import { setSchoolId, setSemesterId } from "../auth/slice";
import { TSchool, TSemester } from "./entity";

// export const useProject = (): string | null => {
//   return useAppSelector((state) => state.);
// };

export const useSemesterInfo = () => {
  const dispatch = useAppDispatch();
  const semesterId = useAppSelector((state) => state.auth.semesterId);
  const schoolId = useAppSelector((state) => state.auth.schoolId);

  const updateSemester = (semester?: TSemester) => {
    dispatch(setSemesterId(semester));
  };

  const updateSchool = (school?: TSchool) => {
    dispatch(setSchoolId(school));
  };

  return {
    semesterId,
    schoolId,
    updateSemester,
    updateSchool,
    semesterName: useAppSelector((state) => state.auth.semesterName),
    schoolName: useAppSelector((state) => state.auth.schoolName),
    yearSemester: useAppSelector((state) => state.auth.yearSemester),
  };
};

export const useAppConfig = () => {
  return useAppSelector((state) => state.projectAdmin.config);
};
