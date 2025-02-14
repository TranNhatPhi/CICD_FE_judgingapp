import {
  Button,
  Flex,
  Grid,
  GridCol,
  Paper,
  Select,
  Text,
  VisuallyHidden,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TProjectRound2Result } from "~/store/features/adminProjects/entity";

const RANKING_CONST = {
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
  FOURTH: 3,
  FIFTH: 4,
};

const Round2Ranking = ({
  data,
  isLoadingMark,
  handleSubmit,
}: {
  data?: TProjectRound2Result[] | undefined;
  isLoadingMark?: boolean;
  handleSubmit?: (ranks: number[]) => void;
}) => {
  const [projectsToSelect, setProjectsToSelect] = useState<
    { id: number; name: string; isSelected: number | null }[]
  >([]);

  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
    if (data) {
      setProjectsToSelect(
        data.map((item) => ({
          id: item.project.id,
          name: `${item.project.groupName} - ${item.project.title}`,
          isSelected: item.project?.rank
            ? RANKING_CONST[item.project.rank as keyof typeof RANKING_CONST]
            : null,
        })),
      );
    }
  }, [data]);

  return (
    <form>
      <Paper radius="lg" p="sm">
        <Flex direction="column" gap="md" miw={360}>
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
                      size="lg"
                      style={{
                        minWidth: 40,
                      }}
                      c={idx < 3 ? "auto" : "gray.6"}
                      ta="center"
                    >
                      {renderRankingEmoji(idx)}
                    </Text>

                    <Text
                      size="lg"
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
                        item.isSelected !== null && item.isSelected !== idx,
                    }))}
                    placeholder="Pick winners"
                    size="md"
                    readOnly={isMarked}
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
          <Grid>
            <GridCol span={12} ta="left">
              <Flex gap="sm" align="center">
                <Text w={60} size="lg">
                  {renderRankingEmoji(0)}
                </Text>
                <Text size="lg">
                  {projectsToSelect?.find((item) => item.isSelected === 0)
                    ?.name ?? ""}
                </Text>
              </Flex>
            </GridCol>
            {...Array(4)
              .fill(0)
              .map((_, idx) => (
                <GridCol span={12} ta="left" key={idx}>
                  <Flex gap="sm" align="center">
                    <Text c={idx > 1 ? "gray.7" : "auto"} w={60} size="lg">
                      {idx > 1 ? `NO. ` : ""}
                      {renderRankingEmoji(idx + 1)}
                    </Text>
                    <Text size="lg">
                      {projectsToSelect?.find(
                        (item) => item.isSelected === idx + 1,
                      )?.name ?? ""}
                    </Text>
                  </Flex>
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
              >
                Edit
              </Button>
              <VisuallyHidden>
                <Button type="submit">Hidden</Button>
              </VisuallyHidden>
            </>
          ) : (
            <Button
              mt={"md"}
              size="compact-lg"
              onClick={() => {
                setIsMarked(true);
                handleSubmit?.(
                  projectsToSelect
                    ?.sort(
                      (a, b) =>
                        (a.isSelected as number) - (b.isSelected as number),
                    )
                    ?.map((item) => item.id) ?? [],
                );
              }}
              loading={isLoadingMark}
            >
              Submit
            </Button>
          )}
        </Flex>
      </Paper>
    </form>
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

export default Round2Ranking;
