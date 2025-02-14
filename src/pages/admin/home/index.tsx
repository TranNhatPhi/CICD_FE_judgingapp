import { Button, Card, Flex, Grid, GridCol, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "~/router/routes";

const AdminHomePage = () => {
  const navigate = useNavigate();
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
            <Text c="gray.8">
              In 2024, seventeen ISIT351 and MTS9351 project groups joined the
              Trade Show. The judging process began with a first round from 1:20
              to 2:20 pm, where judges reviewed projects for 10 minutes each.
              After a brief review, judges shortlisted three groups and shared
              their choices.
            </Text>
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

export default AdminHomePage;
