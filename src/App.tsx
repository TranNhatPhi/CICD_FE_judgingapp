// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import Routings from "~/router/Routings";

import Meta from "./Meta";
import { persistor, store } from "./store";
window.global ||= window;

const App = () => {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications position="top-right" zIndex={1000} />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <Meta />
              <Routings />
            </Router>
          </PersistGate>
        </Provider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
