import React from "react";
import type { IndexRouteProps, PathRouteProps } from "react-router-dom";

const Home = React.lazy(() => import("~/pages/home"));
const Round1 = React.lazy(() => import("~/pages/round1"));
const Round2 = React.lazy(() => import("~/pages/round2"));
const AllProjects = React.lazy(() => import("~/pages/projects"));
const Login = React.lazy(() => import("~/pages/auth/login"));

const AdminProjectList = React.lazy(() => import("~/pages/admin/projects"));
const AdminRound1 = React.lazy(() => import("~/pages/admin/round1"));
const AdminCriteria = React.lazy(() => import("~/pages/admin/criteria"));
const AdminRoundFinal = React.lazy(() => import("~/pages/admin/finalResult"));
const AdminLogin = React.lazy(() => import("~/pages/admin/auth/login"));
const AdminJudgeList = React.lazy(() => import("~/pages/admin/judges"));

export const ROUTES: {
  [key: string]: (PathRouteProps | IndexRouteProps) & {
    isPrivate: boolean;
    title?: string;
  };
} = {
  HOME: {
    path: "/",
    element: <Home />,
    isPrivate: true,
    index: true,
  },
  LOGIN: {
    path: "/login",
    element: <Login />,
    isPrivate: false,
  },
  ROUND1: {
    path: "/round1",
    element: <Round1 />,
    isPrivate: true,
    title: "Round 1",
  },
  ROUND2: {
    path: "/round2",
    element: <Round2 />,
    isPrivate: true,
    title: "Round 2",
  },
  PROJECTS: {
    path: "/projects",
    element: <AllProjects />,
    isPrivate: true,
    title: "All Projects",
  },
};

export const ADMIN_ROUTES: {
  [key: string]: (PathRouteProps | IndexRouteProps) & {
    isPrivate: boolean;
    title?: string;
    index?: boolean;
  };
} = {
  PROJECTS: {
    path: "projects",
    element: <AdminProjectList />,
    isPrivate: true,
  },
  ROUND1: {
    path: "round1",
    element: <AdminRound1 />,
    isPrivate: true,
  },
  CRITERIA: {
    path: "criteria",
    element: <AdminCriteria />,
    isPrivate: true,
  },
  ROUNDFINAL: {
    path: "round/final",
    element: <AdminRoundFinal />,
    isPrivate: true,
  },
  LOGIN: {
    path: "login",
    element: <AdminLogin />,
    isPrivate: false,
  },
  JUDGE: {
    path: "judges",
    element: <AdminJudgeList />,
    isPrivate: true,
  },
};

export const publicRoutes = Object.values(ROUTES).filter(
  ({ isPrivate }) => !isPrivate,
);

export const privateRoutes = Object.values(ROUTES).filter(
  ({ isPrivate }) => isPrivate,
);

export const adminPublicRoutes = Object.values(ADMIN_ROUTES).filter(
  ({ isPrivate }) => !isPrivate,
);

export const adminPrivateRoutes = Object.values(ADMIN_ROUTES).filter(
  ({ isPrivate }) => isPrivate,
);
