import {
  ActionIcon,
  Button,
  Center,
  CopyButton,
  Group,
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
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconSearch,
  IconSelector,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TJudge } from "~/store/features/adminProjects/entity";

import classes from "./index.module.css";

interface RowData extends TJudge {}

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
    <Table.Th className={classes.th}>
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
  const dataKeys = ["groupName", "title", "description"] as (keyof RowData)[];
  return data.filter((item) =>
    dataKeys.some((key) => (item[key] as string).toLowerCase().includes(query)),
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return (b[sortBy] as string).localeCompare(a[sortBy] as string);
      }

      return (a[sortBy] as string).localeCompare(b[sortBy] as string);
    }),
    payload.search,
  );
}

type Props = {
  data: RowData[];
  onEdit: (item: RowData) => void;
  onDelete: (item: RowData) => void;
};
export default function JudgeTable({ data, onEdit, onDelete }: Partial<Props>) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof RowData) => {
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
    <Table.Tr key={row.id}>
      <Table.Td>
        {row.firstName} {row.lastName}
      </Table.Td>
      <Table.Td>
        <Group>
          <Text maw={100} truncate={true}>
            {row.account}
          </Text>
          <CopyButton value={row.account} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? (
                    <IconCheck style={{ width: rem(16) }} />
                  ) : (
                    <IconCopy style={{ width: rem(16) }} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group>
          <Text maw={160} truncate={true}>
            {row.pwd}
          </Text>
          <CopyButton value={row.pwd} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? (
                    <IconCheck style={{ width: rem(16) }} />
                  ) : (
                    <IconCopy style={{ width: rem(16) }} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group>
          <Text maw={200} truncate={true}>
            {row.email}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Button
            size="xs"
            variant="light"
            color="blue"
            onClick={() => onEdit?.(row)}
          >
            Edit
          </Button>
          <ActionIcon
            variant="light"
            color="red"
            onClick={() => onDelete?.(row)}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={
          <IconSearch
            style={{ width: rem(16), height: rem(16) }}
            stroke={1.5}
          />
        }
        value={search}
        onChange={handleSearchChange}
      />
      <Paper>
        <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Th
                sorted={sortBy === "firstName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("firstName")}
              >
                Judge
              </Th>
              <Table.Th w={140}>Account</Table.Th>
              <Th>Password</Th>
              <Table.Th>Email</Table.Th>
              <Table.Th w={200}>Action</Table.Th>
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
