import { ROUTES } from "./routes";

// Based on ROUTES and path, we can find the title of the page in the ROUTES[key].title
export const findTitleByPath = (path: string) => {
  const pathWithoutSlash = path.replace("/", "").toUpperCase();
  const title = ROUTES[pathWithoutSlash]?.title || "404";
  return title;
};
