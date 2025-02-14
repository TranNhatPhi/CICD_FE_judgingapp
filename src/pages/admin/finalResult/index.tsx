import { Button, Flex, Group, Loader, Modal, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SockJS from "sockjs-client";

import AdminProctedBodyLayout from "~/components/layouts/AdminProtectedBodyLayout";
import {
  useAssignWinnersMutation,
  useExportFileWinnersMutation,
  useGetConfigBySemesterIdQuery,
  useGetRound2ListResultQuery,
} from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";
import { setRound1 } from "~/store/features/adminProjects/slice";
import { useAppDispatch } from "~/store/hook";

import Round2Ranking from "./Ranking";
import Round2Table from "./table";

const AdminRoundFinal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExportWinner, setIsExportWinner] = useState(false);
  const dispatch = useAppDispatch();
  const SOCKET_URL = `${import.meta.env.VITE_API_ENDPOINT}/ws`;
  const [openedModal, { toggle: toggleExportModal }] = useDisclosure();
  useEffect(() => {
    setSearchParams({ tab: searchParams?.get("tab") ?? "projects" });
  }, []);

  const { semesterId } = useSemesterInfo();
  const {
    data,
    isLoading,
    refetch: refetchRound2,
  } = useGetRound2ListResultQuery(semesterId, {
    skip: !semesterId,
    refetchOnMountOrArgChange: true,
  });
  const { data: config } = useGetConfigBySemesterIdQuery(semesterId as string, {
    skip: !semesterId,
    pollingInterval: 1000 * 10,
  });

  const [assignWinners, { isLoading: isLoadingAssignWinners }] =
    useAssignWinnersMutation();

  const handleExportWinners = async () => {
    try {
      await exportWinners({
        semesterId,
        name: semesterId,
      }).unwrap();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: (error as { data: { message: string } })?.data?.message ?? "",
        color: "red",
      });
    }
  };
  const handleAssignWinners = async (ranks: number[]) => {
    try {
      await assignWinners({ id: semesterId, body: ranks }).unwrap();
      toggleExportModal();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsExportWinner(true);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: (error as { data: { message: string } })?.data?.message ?? "",
        color: "red",
      });
    }
  };

  const [exportWinners, { isLoading: isLoadingExportWinners }] =
    useExportFileWinnersMutation();

  useEffect(() => {
    if (!config) return;
    setIsExportWinner(config.round2Closed);
  }, [config]);

  // WebSocket subscription for round 2 updates
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("WebSocket connected");
      // Subscribe to round 1 updates
      stompClient.subscribe("/notifications", (notification) => {
        const receivedMessage = JSON.parse(
          (notification.body as string) ?? "{}",
        );
        const { content } = receivedMessage;
        if (content) {
          const result = JSON.parse((content as string) ?? "{}");
          console.log("result", result);
          if (result) {
            // dispatch(setAppConfig(result));
            dispatch(setRound1(result));
            refetchRound2();
          }
        }
        console.log(receivedMessage);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [refetchRound2]);

  return (
    <AdminProctedBodyLayout title="Final result" loadingOverlay={isLoading}>
      <Flex gap="sm" justify={"space-between"} style={{ width: "100%" }}>
        <Flex direction="column" gap="xs">
          <Paper p="sm">
            <Text fw={500}>Current results</Text>
          </Paper>
          <Paper p="sm" style={{ minWidth: 700 }}>
            <Round2Table data={data ?? []} />
          </Paper>
        </Flex>
        <Flex direction="column" gap="xs">
          <Paper p="sm">
            <Group justify="space-between">
              <Text fw={500}>Assign winners</Text>
              <Button
                size="xs"
                loading={isLoadingExportWinners}
                disabled={!isExportWinner}
                onClick={handleExportWinners}
              >
                Export winners
              </Button>
            </Group>
          </Paper>
          <Paper p="sm">
            <Round2Ranking
              data={data}
              isLoadingMark={isLoadingAssignWinners}
              handleSubmit={handleAssignWinners}
            />
          </Paper>
        </Flex>
      </Flex>

      <Modal
        opened={openedModal}
        onClose={toggleExportModal}
        title="Export winners"
        size="sm"
      >
        <Flex direction={"column"} gap={"sm"}>
          <Text>
            Winners chosen successfully. Would you like to download the file of
            winners?
          </Text>

          <Button
            loaderProps={{
              children: (
                <Group align="center" justify="center">
                  <Text size="sm">Generating file</Text>
                  <Loader color="white" type="dots" size="sm" />
                </Group>
              ),
            }}
            loading={!isExportWinner}
            onClick={async () => {
              await handleExportWinners();
              modals.closeAll();
            }}
          >
            {"Download file"}
          </Button>
        </Flex>
      </Modal>
    </AdminProctedBodyLayout>
  );
};

export default AdminRoundFinal;
