import {
  Button,
  Center,
  Flex,
  Group,
  List,
  Paper,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TJudge, TProjectAdmin } from "~/store/features/adminProjects/entity";

import classes from "./index.module.css";

interface RowData {
  judge: TJudge;
  numberOfProjects: number;
  projects: TProjectAdmin[];
}

interface ThProps {
  children: React.ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort?: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th} style={{ width: "80px" }}>
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
  const dataKeys = ["firstName"] as (keyof RowData["judge"])[];
  return data.filter((item) =>
    dataKeys.some((key) =>
      (item.judge[key] as string).toLowerCase().includes(query),
    ),
  );
}

function sortData(
  data: RowData[],
  payload: {
    sortBy: keyof RowData["judge"] | null;
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
        return (b.judge[sortBy] as string).localeCompare(
          a.judge[sortBy] as string,
        );
      }

      return (a.judge[sortBy] as string).localeCompare(
        b.judge[sortBy] as string,
      );
    }),
    payload.search,
  );
}

type Props = {
  data: RowData[];
  selection: number[];
  setSelection: React.Dispatch<React.SetStateAction<number[]>>;
  onHandleAllocate: () => void;
};
export default function Round1Table({
  data,
  setSelection,
  onHandleAllocate,
}: Props) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData["judge"] | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData["judge"]) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data ?? [], { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data ?? [], {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      }),
    );
  };

  const rows = sortedData?.map((row) => (
    <Table.Tr key={row.judge.id}>
      <Table.Td>
        {row.judge.firstName} {row.judge.lastName}
      </Table.Td>
      <Table.Td>{row.numberOfProjects}</Table.Td>
      <Table.Td>
        {/* {row?.projects
          ?.map((item) => `${item.title} ${item.groupName}`)
          .join(", ")} */}
        <List>
          {row.projects.map((project) => (
            <List.Item key={project.id}>
              {project.title} {project.groupName}
            </List.Item>
          ))}
        </List>
      </Table.Td>
      <Table.Td>
        <Tooltip label="Start allocating projects to this judge">
          <Button
            onClick={() => {
              setSelection([row.judge.id]);
              onHandleAllocate();
            }}
          >
            Allocate projects
          </Button>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (
    <ScrollArea>
      <Flex gap="sm" align="center" mb="md">
        <TextInput
          flex={1}
          placeholder="Search by any field"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
      </Flex>
      <Paper>
        <Table horizontalSpacing="md" verticalSpacing="md" layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "firstName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("firstName")}
              >
                Judge
              </Th>
              <Table.Th style={{ width: rem(60) }}>Number of projects</Table.Th>
              <Table.Th style={{ width: rem(140) }}>Projects</Table.Th>
              <Table.Th style={{ width: rem(60) }}>Action</Table.Th>
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
