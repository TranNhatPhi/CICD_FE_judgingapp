import { Box, Flex } from "@mantine/core";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";

import { useGetConfigQuery } from "~/store/features/adminProjects/api";
import { setAppConfig, setRound1 } from "~/store/features/adminProjects/slice";
import { useToken } from "~/store/features/auth/selectors";
import { useAppDispatch } from "~/store/hook";

// import { ROUTES } from "../routes";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  redirectTo?: string;
};

const ProtectedLayout = ({ redirectTo = "/login" }: LayoutProps) => {
  const token = useToken();
  const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useAppDispatch();
  useGetConfigQuery(
    {},
    {
      skip: token === null,
      pollingInterval: 300000, // 5 minutes
    },
  );

  useEffect(() => {
    if (token === undefined) return;
    if (token === null) {
      navigate(redirectTo);
    }
  }, [token]);

  useEffect(() => {
    // Create a SockJS client
    const socket = new SockJS(`${import.meta.env.VITE_API_ENDPOINT}/ws`);

    // Create a STOMP client
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // On Connect, subscribe to the topic
    stompClient.onConnect = () => {
      console.log("Connected");
      stompClient.subscribe("/notifications", (notification) => {
        const receivedMessage = JSON.parse(
          (notification.body as string) ?? "{}",
        );
        const { content } = receivedMessage;
        if (content) {
          const result = JSON.parse((content as string) ?? "{}");
          console.log("result", result);
          if (result) {
            dispatch(setAppConfig(result));
            dispatch(setRound1(result));
          }
        }
        console.log(receivedMessage);
      });
    };

    // Activate the STOMP client
    stompClient.activate();

    // Cleanup on component unmount
    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <Flex direction={"column"} h={"100%"} justify={"space-between"}>
      <Header />
      <Box flex={2} px={"md"} mt={"md"}>
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
};

export default ProtectedLayout;
