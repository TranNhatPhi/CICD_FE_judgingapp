// useAppSelector to select token from auth slice

import { useAppDispatch, useAppSelector } from "~/store/hook";

import { logout } from "./slice";

export const useToken = (): string | null => {
  return useAppSelector((state) => state.auth.token);
};

export const useUserInfo = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const username = useAppSelector((state) => state.auth.username);
  const role = useAppSelector((state) => state.auth.role);
  return { userId, username, role };
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  return () => dispatch(logout());
};
