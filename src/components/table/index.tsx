import {
  ActionIcon,
  Button,
  Center,
  Group,
  Paper,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TProjectAdmin } from "~/store/features/adminProjects/entity";

import classes from "./index.module.css";

interface RowData extends TProjectAdmin {}

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
export default function ProjectTable({
  data,
  onEdit,
  onDelete,
}: Partial<Props>) {
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
      <Table.Td>{row.groupName}</Table.Td>
      <Table.Td>{row.title}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
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
                sorted={sortBy === "groupName"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("groupName")}
              >
                Group Name
              </Th>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Project Title
              </Th>
              <Th>Description</Th>
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
