import * as React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
// import { makeServer } from "./server";

// makeServer();
window.global ||= window;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
