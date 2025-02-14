/**
 * @note
 * for hook alternative of route element composition:
 * - https://reactrouter.com/docs/en/v6/upgrading/v5#use-useroutes-instead-of-react-router-config
 * - https://reactrouter.com/docs/en/v6/examples/route-objects
 *
 * might need to take notes on:
 * - https://reactrouter.com/docs/en/v6/upgrading/v5#note-on-link-to-values
 */

import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "~/AdminLayout";
import AdminAuthLayout from "~/components/layouts/AdminLayout";
import Layout from "~/Layout";
import Page404 from "~/pages/404";

import ProtectedLayout from "./protected-route";
import AuthLayout from "./public-route";
import {
  adminPrivateRoutes,
  adminPublicRoutes,
  privateRoutes,
  publicRoutes,
} from "./routes";

const Routings = () => {
  return (
    <Suspense>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<AuthLayout />}>
            {publicRoutes.map((routeProps) => (
              <Route
                {...routeProps}
                key={`public-${routeProps.path as string}`}
              />
            ))}
          </Route>
          <Route element={<ProtectedLayout />}>
            {privateRoutes.map(({ element, ...privateRouteProps }) => (
              <Route
                element={element}
                {...privateRouteProps}
                key={`privateRoute-${privateRouteProps.path}`}
              />
            ))}
          </Route>
        </Route>
        <Route path="/admin" element={<AdminAuthLayout />}>
          {adminPublicRoutes.map((routeProps) => (
            <Route
              {...routeProps}
              key={`public-admin-${routeProps.path as string}`}
            />
          ))}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="/admin/projects" />}
            key={`private-admin-index`}
          />
          {adminPrivateRoutes.map(({ element, ...privateRouteProps }) => {
            // if (privateRouteProps?.index) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            //   const { path, ...routeProps } = privateRouteProps;
            //   return (
            //     <Route
            //       {...routeProps}
            //       index={true}
            //       element={element}
            //       key={`private-admin-index`}
            //     />
            //   );
            // }

            return (
              <Route
                {...privateRouteProps}
                element={element}
                key={`private-admin-${privateRouteProps.path}`}
              />
            );
          })}
        </Route>
        <Route path="/admin/*" element={<Page404 redirectTo="/admin" />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default Routings;
