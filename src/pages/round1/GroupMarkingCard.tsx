import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Modal,
  Overlay,
  Paper,
  Rating,
  Text,
  Textarea,
  VisuallyHidden,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

import { TCriteria } from "~/store/features/projects/entity";

import { TMarkingRound1Schema, TRound1MarkFormSchema } from "./utils/schema";

const GroupMarkingCard = (props: {
  id: number;
  title: string;
  project: string;
  markResult: number;
  isMarked: boolean;
  onMark: (values: TRound1MarkFormSchema) => void;
  isLoading: boolean;
  criteria: TMarkingRound1Schema;
  description: string;
  criteriaList?: TCriteria[];
  comment?: string;
  disabled?: boolean;
}) => {
  const [marked, setMarked] = useState(props.isMarked);
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { ...props.criteria, comment: props?.comment },
  });

  const handleSubmit = (values: typeof form.values) => {
    const { comment, criteria: marks } = values;
    const criteriaMark = Object.values(marks).reduce(
      (cur, item, index) => {
        console.log(
          "props?.criteriaList?.[index]",
          props?.criteriaList?.[index],
        );
        const criteriaId = props?.criteriaList?.[index]?.id ?? 0;
        cur[criteriaId] = item + 4;
        return cur;
      },
      {} as { [key: number]: number },
    );

    props?.onMark({
      mark: criteriaMark,
      projectId: props?.id,
      comment: comment,
    });
    setMarked(true);
  };

  useEffect(() => {
    setMarked(props.isMarked);
  }, [props.isMarked]);

  useEffect(() => {
    if (!form.isDirty("criteria")) {
      form.setValues({ ...props.criteria, comment: props?.comment });
    }
  }, [props?.criteria]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Card radius="lg" padding="lg" pos="relative">
        {props?.disabled && <Overlay opacity={0.95} />}
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
            <Button size="md" variant="light" miw={100} onClick={openDetail}>
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

            {marked ? (
              <>
                <Grid.Col span={12}>
                  <Flex justify={"space-between"} align={"center"}>
                    <Text size="sm" fw={600} c="blue.9">
                      Criterion
                    </Text>
                    <Text size="sm" fw={600} c="blue.9">
                      Grade
                    </Text>
                  </Flex>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Divider />
                </Grid.Col>
              </>
            ) : (
              <></>
            )}
            {props?.criteriaList?.map((item, idx) => (
              <Grid.Col span={12} key={item.id}>
                <Flex
                  mb="xs"
                  direction={marked ? "row" : "column"}
                  justify={marked ? "space-between" : "-moz-initial"}
                >
                  <Text size="sm" c="blue.7">
                    {idx + 1}. {item.criteriaName}
                  </Text>
                  {marked ? (
                    <Text size="md" fw={700} c={"blue.7"}>
                      {props.criteria.criteria[
                        `criteria${idx + 1}` as keyof TMarkingRound1Schema["criteria"]
                      ] + 4}
                    </Text>
                  ) : (
                    <></>
                  )}
                </Flex>

                {marked ? (
                  <></>
                ) : (
                  <Rating
                    count={6}
                    highlightSelectedOnly
                    key={form.key(`criteria.criteria${idx + 1}`)}
                    emptySymbol={getEmptyIcon}
                    fullSymbol={getFullIcon}
                    {...form.getInputProps(`criteria.criteria${idx + 1}`)}
                    onChange={(value) => {
                      form.setFieldValue(`criteria.criteria${idx + 1}`, value);
                    }}
                    w={"100%"}
                    style={{ justifyContent: "space-between" }}
                  />
                )}
              </Grid.Col>
            ))}
          </Grid>
        </Card.Section>

        <Card.Section inheritPadding py="sm">
          <Textarea
            label="Note"
            {...form.getInputProps("comment")}
            readOnly={marked}
            autosize
            minRows={4}
          />
          <Flex justify={"space-between"} align={"center"} mt="sm">
            <Text>
              Total scores:{" "}
              <Text component="span" fw={700} size="xl" c="blue">
                {marked
                  ? props?.markResult
                  : Object.values(form.values.criteria).reduce((acc, item) => {
                      if (item > 0) {
                        return acc + item + 4;
                      }
                      return acc;
                    }, 0)}
              </Text>
            </Text>

            {marked ? (
              <>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => setMarked(false)}
                  type="button"
                  disabled={props?.disabled}
                >
                  Edit
                </Button>
                <VisuallyHidden>
                  <Button
                    type="submit"
                    hidden
                    disabled={props?.disabled}
                  ></Button>
                </VisuallyHidden>
              </>
            ) : (
              <Button
                size="md"
                type="submit"
                loading={props?.isLoading}
                disabled={props?.disabled}
              >
                Submit
              </Button>
            )}
          </Flex>
        </Card.Section>
      </Card>
      <Modal
        opened={openedDetail}
        onClose={closeDetail}
        title="Project Detail"
        centered
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Flex
          justify={"space-between"}
          align={"start"}
          gap={"sm"}
          direction="column"
        >
          <Flex direction={"column"}>
            <Flex justify={"space-between"} gap="sm">
              <Text fw={700} size="md" w={60}>
                Name
              </Text>
              <Text c="orange.8" flex={1}>
                {props?.title}
              </Text>
            </Flex>

            <Flex justify={"space-between"} gap="sm">
              <Text fw={700} size="md" w={60}>
                Project
              </Text>
              <Text c="orange.8" flex={1}>
                {props?.project}
              </Text>
            </Flex>
          </Flex>
          <Divider size="sm" flex={1} w="100%" />
          <Flex direction="column">
            <Text fw={700}>Description</Text>
            <Text>{props?.description}</Text>
          </Flex>
        </Flex>
      </Modal>
    </form>
  );
};

const getEmptyIcon = (value: number) => {
  return (
    <Paper
      style={{
        width: 44,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      withBorder
    >
      {value + 4}
    </Paper>
  );
};

const getFullIcon = (value: number) => {
  return (
    <Paper
      style={{
        width: 44,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      withBorder
      bg={"blue"}
      c="white"
    >
      {value + 4}
    </Paper>
  );
};

export default GroupMarkingCard;
