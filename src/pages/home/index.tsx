import { Button, Card, Flex, Grid, GridCol, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "~/router/routes";
import { useAppConfig } from "~/store/features/adminProjects/selectors";

const HomePage = () => {
  const navigate = useNavigate();

  const { description } = useAppConfig();
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
          <Button
            fullWidth
            size="lg"
            bg="dark.7"
            rightSection={<IconChevronRight />}
            onClick={() => navigate(ROUTES.PROJECTS.path as string)}
          >
            All Projects
          </Button>
          <Button
            fullWidth
            size="lg"
            rightSection={<IconChevronRight />}
            bg="indigo.9"
            onClick={() => navigate(ROUTES.ROUND1.path as string)}
          >
            Round 1 - Main Round
          </Button>
          <Button
            fullWidth
            size="lg"
            bg="dark.2"
            rightSection={<IconChevronRight />}
            onClick={() => navigate(ROUTES.ROUND2.path as string)}
          >
            Round 2 - Final
          </Button>
        </Flex>
      </GridCol>
    </Grid>
  );
};

export default HomePage;
