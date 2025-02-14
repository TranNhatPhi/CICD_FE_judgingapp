import { Button, Card, Flex, Grid, GridCol, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";

import GroupCard from "~/components/group-card";
import { useAppConfig } from "~/store/features/adminProjects/selectors";
import { useUserInfo } from "~/store/features/auth/selectors";
import {
  useGetAllocedProjectsQuery,
  useGetCriteriaRound1Query,
  useMarkRound1ByProjectIdMutation,
} from "~/store/features/projects/api";

import GroupMarkingCard from "./GroupMarkingCard";
import {
  convertCriteriaMarkToSchema,
  TRound1MarkFormSchema,
} from "./utils/schema";

const Round1 = () => {
  const { userId } = useUserInfo();
  const {
    data: projectList,
    refetch: refetchProjectList,
    isSuccess: isProjectListSuccess,
  } = useGetAllocedProjectsQuery(userId!, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const { data: criteriaList } = useGetCriteriaRound1Query({});
  const { round1Closed, description } = useAppConfig();

  const [markRound1, { isLoading: isLoadingMarkRequest, reset }] =
    useMarkRound1ByProjectIdMutation();

  const handleMark = async (values: TRound1MarkFormSchema, id: number) => {
    await markRound1({
      ...values,
      judgeId: Number(userId),
    }).unwrap();
    setOpenedGroup(
      openedGroup.map((group) => {
        if (group.id === id) {
          return {
            ...group,
            opened: !group.opened,
          };
        }
        return group;
      }),
    );

    modals.open({
      centered: true,
      size: "xs",
      title: "Marking Success",
      children: (
        <>
          <Text c="green">Your marking is successfully updated!</Text>
          <Button
            fullWidth
            onClick={() => modals.closeAll()}
            mt="md"
            bg="green"
          >
            Ok
          </Button>
        </>
      ),
    });
    reset();
    refetchProjectList();
  };

  const [openedGroup, setOpenedGroup] = useState<
    { id: number; opened: boolean }[]
  >([]);

  useEffect(() => {
    if (isProjectListSuccess) {
      setOpenedGroup(
        projectList?.map((item) => ({
          id: item.projectId,
          opened: false,
        })) || [],
      );
    }
  }, [isProjectListSuccess]);

  return (
    <Grid gutter={"lg"} py="lg">
      <GridCol span={12}>
        <Card radius="lg">
          <Card.Section p={"lg"}>
            <Text size="xl" fw={700} c={"blue"}>
              Judging Principle
            </Text>
          </Card.Section>
          <Card.Section px={"lg"} pb="lg">
            <Text c="gray.8">{description}</Text>
          </Card.Section>
        </Card>
      </GridCol>
      <GridCol span={12}>
        <Text fw={700} size="lg">
          Team List & Scores
        </Text>
      </GridCol>
      <GridCol span={12}>
        <Flex gap="lg" direction={"column"} w={"100%"}>
          {projectList?.map((item) => (
            <GroupCard
              isMarked={item.markedBỵJudge}
              markResult={item?.totalMark ?? 0}
              key={`${item.groupName}`}
              title={`${item.groupName}`}
              opened={
                openedGroup.find((group) => group.id === item.projectId)
                  ?.opened ?? false
              }
              toggle={() => {
                setOpenedGroup(
                  openedGroup.map((group) => {
                    if (group.id === item.projectId) {
                      return {
                        ...group,
                        opened: !group.opened,
                      };
                    }
                    return group;
                  }),
                );
              }}
            >
              <GroupMarkingCard
                description={item.description ?? ""}
                title={item.groupName}
                project={item.projectTitle}
                markResult={item.totalMark ?? 0}
                isMarked={item.markedBỵJudge}
                onMark={(values) => handleMark(values, item.projectId)}
                isLoading={isLoadingMarkRequest}
                id={item.projectId}
                criteria={convertCriteriaMarkToSchema(item, criteriaList ?? [])}
                criteriaList={criteriaList ?? []}
                comment={item?.comment}
                disabled={round1Closed}
              />
            </GroupCard>
          ))}
        </Flex>
      </GridCol>
    </Grid>
  );
};

export default Round1;
