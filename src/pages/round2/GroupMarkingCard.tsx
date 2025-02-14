import { Button, Card, Flex, Grid, Text } from "@mantine/core";

import { CRITERIA_LABELS } from "./utils/constants";

const GroupMarkingCard = (props: {
  title: string;
  project: string;
  markResult: number;
}) => {
  return (
    <Card radius="lg" padding="lg">
      <Card.Section inheritPadding withBorder py="sm">
        <Flex justify={"space-between"} align={"center"} gap={"sm"}>
          <Flex direction={"column"}>
            <Flex justify={"space-between"} gap="sm">
              <Text size="md" w={60}>
                Name
              </Text>
              <Text c="orange.8" flex={1}>
                {props?.title}
              </Text>
            </Flex>

            <Flex justify={"space-between"} gap="sm">
              <Text size="md" w={60}>
                Project
              </Text>
              <Text c="orange.8" flex={1}>
                {props?.project}
              </Text>
            </Flex>
          </Flex>
          <Button size="md" variant="light" miw={100}>
            Detail
          </Button>
        </Flex>
      </Card.Section>
      <Card.Section inheritPadding py="sm">
        <Grid gutter="md">
          <Grid.Col span={12}>
            <Text size="md" fw={700}>
              Project Evaluation
            </Text>
          </Grid.Col>

          {CRITERIA_LABELS.map((item, idx) => (
            <Grid.Col span={12} key={item}>
              <Flex mb="xs">
                <Text size="sm" c="blue.7">
                  {idx + 1}. {item}
                </Text>
              </Flex>
              <Flex wrap={"wrap"} gap="xs">
                {...Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Button
                      key={`${item}_mark_${index + 5}`}
                      size="compact-md"
                      variant={
                        props?.markResult == index + 5 ? "filled" : "default"
                      }
                      style={{
                        width: 44,
                        height: 40,
                      }}
                    >
                      {index + 5}
                    </Button>
                  ))}
              </Flex>
            </Grid.Col>
          ))}
        </Grid>
      </Card.Section>

      <Card.Section inheritPadding py="sm" mt={"sm"}>
        <Flex justify={"space-between"} align={"center"}>
          <Text>Total scores: {props?.markResult}</Text>
          <Button size="md">Submit</Button>
        </Flex>
      </Card.Section>
    </Card>
  );
};
export default GroupMarkingCard;
