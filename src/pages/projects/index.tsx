import { Card, Flex, Grid, GridCol, Text } from "@mantine/core";
import { useEffect, useState } from "react";

import GroupCard from "~/components/group-card";
import ProjectInfoCard from "~/components/project-info";
import { useAppConfig } from "~/store/features/adminProjects/selectors";
import { useGetProjectListJudgeQuery } from "~/store/features/projects/api";

const Projects = () => {
  const { data: projectList, isSuccess } = useGetProjectListJudgeQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [openedGroup, setOpenedGroup] = useState<
    { id: number; opened: boolean }[]
  >([]);

  const { description } = useAppConfig();

  useEffect(() => {
    if (isSuccess) {
      setOpenedGroup(
        projectList?.map((item) => ({
          id: item.id,
          opened: false,
        })) || [],
      );
    }
  }, [isSuccess]);

  return (
    <Grid gutter={"lg"} py="lg">
      <GridCol span={12}>
        <Card radius="lg">
          <Card.Section p={"lg"}>
            <Text size="xl" fw={700}>
              Introduction
            </Text>
          </Card.Section>
          <Card.Section px={"lg"} pb="lg">
            <Text c="gray.8">{description}</Text>
          </Card.Section>
        </Card>
      </GridCol>
      <GridCol span={12}>
        <Flex gap="lg" direction={"column"} w={"100%"}>
          {projectList?.map((item, index) => (
            <GroupCard
              key={index}
              title={`${item.groupName}`}
              opened={openedGroup[index]?.opened}
              toggle={() => {
                setOpenedGroup(
                  openedGroup.map((group) => {
                    if (group.id === item.id) {
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
              <ProjectInfoCard
                title={item.title}
                abstract={item.description}
                groupName={item.groupName || ""}
              />
            </GroupCard>
          ))}
        </Flex>
      </GridCol>
    </Grid>
  );
};

export default Projects;
