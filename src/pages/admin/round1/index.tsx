import { rem, Tabs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Client } from "@stomp/stompjs";
import { IconJoinRound, IconUsersGroup } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SockJS from "sockjs-client";

import AdminProctedBodyLayout from "~/components/layouts/AdminProtectedBodyLayout";
import {
  useAssignJudgesToProjectsMutation,
  useConfirmProjectsToRound2Mutation,
  useGetRound1JudgeListQuery,
  useGetRound1ListResultQuery,
} from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";
import { setRound1 } from "~/store/features/adminProjects/slice";
import { useAppDispatch } from "~/store/hook";

import AllocateJudgesModal from "./modal";
import SelectProjectsToRound2Modal from "./modal/SelectProjectsToRound2Modal";
import Round1Table from "./table";
import Round2Table from "./table/Round2Table";

const AdminRound1 = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const SOCKET_URL = `${import.meta.env.VITE_API_ENDPOINT}/ws`;

  useEffect(() => {
    setSearchParams({ tab: searchParams?.get("tab") ?? "projects" });
  }, []);

  const [openAllocateModal, setOpenAllocateModal] = useState(false);
  const [selection, setSelection] = useState<number[]>([]);

  const { semesterId } = useSemesterInfo();
  const {
    data: projectListForRound1,
    isLoading: isLoadingProjectsForRound1,
    refetch,
  } = useGetRound1JudgeListQuery(semesterId, {
    skip: !semesterId,
    refetchOnMountOrArgChange: true,
  });

  const [assignJudges, { isLoading: isAssigningJudges }] =
    useAssignJudgesToProjectsMutation();

  const handleAssignJudges = async (projectIds: string[]) => {
    // convert selection to projectIds, then assign judges to projects
    const requests = selection?.map((item) => ({
      judgeId: Number(item),
      projectIds: projectIds?.map((id) => Number(id)),
    }));
    try {
      await assignJudges({ id: semesterId, requests }).unwrap();
      setOpenAllocateModal(false);
      notifications.show({
        title: "Success",
        message: "Judges assigned successfully",
        color: "green",
      });
      refetch();
    } catch (error) {
      console.log("error", error);
      setOpenAllocateModal(false);
      notifications.show({
        title: "Error",
        message: (error as { data: { message: string } })?.data?.message ?? "",
        color: "red",
      });
    }
  };

  const [openSelectProjectsToRound2, setOpenSelectProjectsToRound2] =
    useState(false);
  const [selectionRound2, setSelectionRound2] = useState<number[]>([]);

  const {
    data,
    isLoading: isLoadingListRound1Result,
    refetch: refetchRound1ListResult,
  } = useGetRound1ListResultQuery(semesterId, {
    skip: !semesterId,
    refetchOnMountOrArgChange: true,
  });

  // WebSocket for Round 1 updates
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
            refetchRound1ListResult();
          }
        }
        console.log(receivedMessage);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [refetchRound1ListResult]);

  const [confirmProjectsToRound2, { isLoading: isConfirmingProjectsToRound2 }] =
    useConfirmProjectsToRound2Mutation();

  const handleConfirmProjectsToRound2 = async () => {
    try {
      await confirmProjectsToRound2({
        id: semesterId,
        body: selectionRound2.map((id) => Number(id)),
      }).unwrap();
      setOpenSelectProjectsToRound2(false);
      notifications.show({
        title: "Success",
        message: "Projects confirmed to round 2 successfully",
        color: "green",
      });
    } catch (err) {
      console.log("err", err);
      setOpenSelectProjectsToRound2(false);
      notifications.show({
        title: "Error",
        message: (err as { data: { message: string } })?.data?.message ?? "",
        color: "red",
      });
    } finally {
      setOpenSelectProjectsToRound2(false);
      refetchRound1ListResult();
      setSelectionRound2([]);
    }
  };
  return (
    <AdminProctedBodyLayout
      title="Round 1"
      loadingOverlay={isLoadingProjectsForRound1 || isLoadingListRound1Result}
    >
      <Tabs
        value={(searchParams.get("tab") || "projects") as string}
        onChange={(value) => {
          setSearchParams({ tab: value as string });
        }}
      >
        <Tabs.List bg="white" mb="sm">
          <Tabs.Tab
            value="projects"
            leftSection={<IconUsersGroup style={iconStyle} />}
          >
            Allocate judges
          </Tabs.Tab>
          <Tabs.Tab
            value="results"
            leftSection={<IconJoinRound style={iconStyle} />}
          >
            Result round 1
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="projects">
          <Round1Table
            data={projectListForRound1 ?? []}
            selection={selection}
            setSelection={setSelection}
            onHandleAllocate={() => setOpenAllocateModal(true)}
          />

          <AllocateJudgesModal
            isOpen={openAllocateModal}
            onClose={() => {
              setSelection([]);
              setOpenAllocateModal(false);
            }}
            judges={
              projectListForRound1
                ?.filter((item) => selection?.includes(item.judge.id))
                .map((item) => ({
                  name: `${item.judge.firstName} ${item.judge.lastName}`,
                })) ?? []
            }
            onSubmit={handleAssignJudges}
            loading={isAssigningJudges}
            projectIds={
              projectListForRound1
                ?.filter((item) => selection?.includes(item.judge.id))?.[0]
                ?.projects?.map((item) => item.id.toString()) ?? []
            }
          />
        </Tabs.Panel>

        <Tabs.Panel value="results">
          <Round2Table
            data={data ?? []}
            selection={selectionRound2}
            setSelection={setSelectionRound2}
            onHandleAllocate={() => setOpenSelectProjectsToRound2(true)}
          />

          <SelectProjectsToRound2Modal
            isOpen={openSelectProjectsToRound2}
            onClose={() => {
              setSelectionRound2([]);
              setOpenSelectProjectsToRound2(false);
            }}
            projects={
              data
                ?.filter((item) => selectionRound2?.includes(item.project.id))
                .map((item) => ({
                  groupName: item.project.groupName,
                  title: item.project.title,
                })) ?? []
            }
            onSubmit={handleConfirmProjectsToRound2}
            loading={isConfirmingProjectsToRound2}
          />
        </Tabs.Panel>
      </Tabs>
    </AdminProctedBodyLayout>
  );
};
export default AdminRound1;
