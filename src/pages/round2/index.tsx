import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  GridCol,
  Paper,
  Select,
  Text,
  Textarea,
  VisuallyHidden,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import GroupCard from "~/components/group-card";
import ProjectInfoCard from "~/components/project-info";
import { useAppConfig } from "~/store/features/adminProjects/selectors";
import { useUserInfo } from "~/store/features/auth/selectors";
import {
  useGetRound2ProjectsQuery,
  useMarkRound2ByProjectIdMutation,
} from "~/store/features/projects/api";

const Round2 = () => {
  const { userId } = useUserInfo();
  const {
    data: projectList,
    isSuccess: isSuccessLoadingList,
    refetch,
  } = useGetRound2ProjectsQuery(userId!, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });
  const [opened, setOpenedGroup] = useState([false, false]);
  const [projectsToSelect, setProjectsToSelect] = useState<
    { id: number; name: string; isSelected: number | null }[]
  >([]);
  const [comment, setComment] = useState("");

  const [isMarked, setIsMarked] = useState(false);

  const { round2Closed, description } = useAppConfig();
  const [markRound2, { isLoading: isLoadingMark }] =
    useMarkRound2ByProjectIdMutation();

  useEffect(() => {
    if (isSuccessLoadingList) {
      setProjectsToSelect(
        projectList?.map((item) => ({
          id: item?.project?.id ?? 0,
          name: item.project?.groupName ?? "",
          isSelected:
            (item?.totalMark ?? 0) > 0 ? Math.abs(5 - item.totalMark!) : null,
        })) || [],
      );
      setIsMarked(projectList?.some((item) => !!item?.markedBỵJudge));
      setComment(projectList?.find((item) => !!item?.comment)?.comment ?? "");
    }
  }, [isSuccessLoadingList, projectList]);

  const handleSubmit = async () => {
    if (projectsToSelect.find((item) => item.isSelected === null)) {
      modals.open({
        centered: true,
        size: "xs",
        title: "Marking Warning",
        children: (
          <>
            <Text c="red" fw={600}>
              Please select all 5 winners!
            </Text>
            <Button
              fullWidth
              onClick={() => modals.closeAll()}
              mt="md"
              variant="default"
            >
              Ok
            </Button>
          </>
        ),
      });
      return;
    }

    /*
    Turn this: [{ "1": 5 }, { "2": 4 }, { "3": 3 }, { "4": 2 }, { "5": 1 }]
    Into this: { "1": 5, "2": 4, "3": 3, "4": 2, "5": 1 }
    */
    const projectMarks = projectsToSelect.reduce(
      (acc, item) => {
        if (item.isSelected !== null) {
          acc[item.id] = Math.abs(5 - item.isSelected);
        }
        return acc;
      },
      {} as { [key: string]: number },
    );
    await markRound2({
      judgeId: Number(userId!),
      projectMarks,
      comment,
    }).unwrap();
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
    setIsMarked(true);
    setOpenedGroup([false, false]);
    refetch();
  };

  return (
    <Grid gutter={"lg"} py="lg">
      <GridCol span={12}>
        <Card radius="lg">
          <Card.Section p={"lg"}>
            <Text
              size="xl"
              fw={700}
              variant="gradient"
              gradient={{
                from: "#0036D0",
                to: "#B31010",
                deg: 45,
              }}
            >
              Judging Principle
            </Text>
          </Card.Section>
          <Card.Section px={"lg"} pb="lg">
            <Text c="gray.8">{description}</Text>
          </Card.Section>
        </Card>
      </GridCol>
      <GridCol span={12}>
        <GroupCard
          title={"Shortlisted Teams (5 Teams)"}
          opened={opened[0]}
          toggle={() => setOpenedGroup([!opened[0], opened[1]])}
        >
          {projectList?.map((item) => (
            <Box key={item.project.id} mb={"md"}>
              <ProjectInfoCard
                title={item?.project.groupName ?? ""} // TEST (EVAN): Show group name
                abstract={item.project?.description}
                groupName={item.project.title}
              />
            </Box>
          ))}
        </GroupCard>
      </GridCol>

      <GridCol span={12}>
        <GroupCard
          title={"Ranking"}
          opened={opened[1]}
          toggle={() => setOpenedGroup((prev) => [prev[0], !prev[1]])}
          isGradient
        >
          <Grid>
            <GridCol span={12}>
              <form>
                <Paper radius="lg" p="lg">
                  <Flex direction="column" gap="md">
                    {...Array(5)
                      .fill(0)
                      .map((_, idx) => {
                        const value =
                          projectsToSelect
                            ?.find((item) => item.isSelected === idx)
                            ?.id.toString() ?? null;
                        return (
                          <Flex
                            direction={"column"}
                            gap={"xs"}
                            key={renderRankingTitle(idx)}
                          >
                            <Flex gap="xs" align={"center"}>
                              <Text
                                size="xl"
                                style={{
                                  fontSize: 32,
                                  minWidth: 40,
                                }}
                                c={idx < 3 ? "auto" : "gray.6"}
                                ta="center"
                              >
                                {renderRankingEmoji(idx)}
                              </Text>

                              <Text
                                size="xl"
                                style={{
                                  fontSize: 28,
                                }}
                                variant={idx < 3 ? "gradient" : "text"}
                                gradient={{
                                  from: "#0036D0",
                                  to: "#B31010",
                                  deg: 45,
                                }}
                              >
                                {renderRankingTitle(idx)}
                              </Text>
                            </Flex>

                            <Select
                              checkIconPosition="left"
                              data={projectsToSelect?.map((item) => ({
                                value: item?.id.toString(),
                                label: item.name,
                                disabled:
                                  item.isSelected !== null &&
                                  item.isSelected !== idx,
                              }))}
                              placeholder="Pick winners"
                              size="lg"
                              readOnly={isMarked || round2Closed}
                              {...(isMarked
                                ? {
                                    rightSection: <IconCheck />,
                                    variant: "unstyled",
                                  }
                                : {})}
                              value={value}
                              onChange={(_value) => {
                                console.log("_value", _value);
                                if (_value === null) {
                                  setProjectsToSelect(
                                    projectsToSelect?.map((item) => {
                                      if (item.isSelected === idx) {
                                        console.log(
                                          "item.isSelected === idx",
                                          item.isSelected === idx,
                                          idx,
                                          item.isSelected,
                                        );
                                        return {
                                          ...item,
                                          isSelected: null,
                                        };
                                      }
                                      return item;
                                    }),
                                  );
                                  return;
                                }
                                setProjectsToSelect(
                                  projectsToSelect?.map((item) => {
                                    if (item.isSelected === idx) {
                                      return {
                                        ...item,
                                        isSelected: null,
                                      };
                                    }
                                    if (item.id === Number(_value)) {
                                      return {
                                        ...item,
                                        isSelected: idx,
                                      };
                                    }
                                    return item;
                                  }) ?? [],
                                );
                              }}
                              clearable
                            />
                          </Flex>
                        );
                      })}
                    <GridCol span={12}>
                      <Textarea
                        label="Note"
                        readOnly={isMarked || round2Closed}
                        autosize
                        placeholder="Leave your comments here"
                        value={comment}
                        onChange={(e) => setComment(e.currentTarget.value)}
                        minRows={4}
                      />
                    </GridCol>
                    <Grid>
                      <GridCol span={12} ta="center">
                        <Text size="xl">
                          {renderRankingEmoji(0)}{" "}
                          {projectsToSelect?.find(
                            (item) => item.isSelected === 0,
                          )?.name ?? ""}
                        </Text>
                      </GridCol>
                      {...Array(4)
                        .fill(0)
                        .map((_, idx) => (
                          <GridCol span={6} ta="center" key={idx}>
                            <Text size="xl">
                              <Text
                                component="span"
                                c={idx > 1 ? "gray.7" : "auto"}
                              >
                                {idx > 1 ? `NO. ` : ""}
                                {renderRankingEmoji(idx + 1)}
                              </Text>{" "}
                              {projectsToSelect?.find(
                                (item) => item.isSelected === idx + 1,
                              )?.name ?? ""}
                            </Text>
                          </GridCol>
                        ))}
                    </Grid>
                    {isMarked ? (
                      <>
                        <Button
                          mt={"md"}
                          size="compact-lg"
                          onClick={() => setIsMarked(false)}
                          type="button"
                          variant="outline"
                          disabled={round2Closed}
                        >
                          Edit
                        </Button>
                        <VisuallyHidden>
                          <Button type="submit" disabled={round2Closed}>
                            Hidden
                          </Button>
                        </VisuallyHidden>
                      </>
                    ) : (
                      <Button
                        mt={"md"}
                        size="compact-lg"
                        onClick={handleSubmit}
                        loading={isLoadingMark}
                        disabled={round2Closed}
                      >
                        Submit
                      </Button>
                    )}
                  </Flex>
                </Paper>
              </form>
            </GridCol>
          </Grid>
        </GroupCard>
      </GridCol>
    </Grid>
  );
};

const renderRankingTitle = (index: number) => {
  switch (index) {
    case 0:
      return "First place";
    case 1:
      return "Second place";
    case 2:
      return "Third place";
    case 3:
      return "Fourth place";
    default:
      return "Fifth place";
  }
};
const renderRankingEmoji = (index: number) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    case 3:
      return "4";
    default:
      return "5";
  }
};
export default Round2;
