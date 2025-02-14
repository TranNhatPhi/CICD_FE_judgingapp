import {
  Center,
  Flex,
  Group,
  Paper,
  rem,
  ScrollArea,
  Table,
  TableThProps,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TProjectRound2Result } from "~/store/features/adminProjects/entity";

import classes from "./index.module.css";

interface RowData extends TProjectRound2Result {}

interface ThProps extends TableThProps {
  children: React.ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort?: () => void;
}

function Th({ children, reversed, sorted, onSort, ...restOfProps }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th {...restOfProps} className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          {onSort ? (
            <Center className={classes.icon}>
              <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </Center>
          ) : (
            <></>
          )}
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  const dataKeys = ["groupName", "title"] as (keyof RowData["project"])[];
  return data.filter((item) =>
    dataKeys.some((key) =>
      (item.project[key] as string).toLowerCase().includes(query),
    ),
  );
}

function sortData(
  data: RowData[],
  payload: {
    sortBy: keyof RowData["project"] | null;
    reversed: boolean;
    search: string;
  },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return (b.project[sortBy] as string).localeCompare(
          a.project[sortBy] as string,
        );
      }

      return (a.project[sortBy] as string).localeCompare(
        b.project[sortBy] as string,
      );
    }),
    payload.search,
  );
}

type Props = {
  data: RowData[];
};
export default function Round2Table({ data }: Props) {
  const [search] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData["project"] | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData["project"]) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data ?? [], { sortBy: field, reversed, search }));
  };

  const rows = sortedData?.map((row) => (
    <Table.Tr key={row.project.id}>
      <Table.Td>{row.project.averageMarkV2}</Table.Td>
      <Table.Td>
        <Flex direction="column" gap="xs">
          <Text size="md">{row.project.title}</Text>
          <Text size="sm" c="gray">
            {row.project.groupName}
          </Text>
        </Flex>
      </Table.Td>
      <Table.Td>
        {row?.judgesMarked
          ?.map((item) => `${item.firstName} ${item.lastName}`)
          .join(", ")}
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (
    <ScrollArea>
      <Paper>
        <Table horizontalSpacing="md" verticalSpacing="xs">
          <Table.Tbody>
            <Table.Tr>
              <Th style={{ width: rem(80) }} ta="center">
                Scores
              </Th>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Projects
              </Th>
              <Th>Marked by</Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows?.length ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </ScrollArea>
  );
}
