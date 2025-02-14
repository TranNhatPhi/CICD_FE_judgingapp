import { Box, Button, Collapse, Flex, Group, Text } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
// import { useEffect } from "react";

type GroupCardProps = {
  title: string;
  opened: boolean;
  toggle: () => void;
  children: React.ReactNode;
  isMarked?: boolean;
  isGradient?: boolean;
  markResult?: number;
};
export default function GroupCard({
  title,
  children,
  opened,
  toggle,
  isMarked,
  isGradient,
  markResult,
}: GroupCardProps) {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  return (
    <Box maw={"100%"}>
      <Group justify="center" mb={"sm"}>
        <Button
          onClick={() => {
            toggle();
          }}
          size="lg"
          fullWidth
          bg={isGradient ? undefined : isMarked ? "white" : "indigo.9"}
          variant={isGradient ? "gradient" : isMarked ? "outline" : "filled"}
          leftSection={
            isMarked ? (
              <Flex gap="sm" align="center" p="sm" bg="blue">
                <Text component="span" fw={700} c="white" size="xl">
                  {markResult}
                </Text>
                {/* <IconCheck color="white" /> */}
              </Flex>
            ) : null
          }
          justify="space-between"
          rightSection={opened ? <IconChevronUp /> : <IconChevronDown />}
          gradient={{
            from: "#0036D0",
            to: "#B31010",
            deg: 45,
          }}
          {...(isMarked ? { pl: 0 } : {})}
        >
          {title}
        </Button>
      </Group>

      <Collapse
        in={opened}
        transitionDuration={300}
        transitionTimingFunction="linear"
        onTransitionEnd={() => {
          if (opened) {
            scrollIntoView({
              alignment: "start",
            });
          }
        }}
        ref={targetRef}
      >
        {children}
      </Collapse>
    </Box>
  );
}
