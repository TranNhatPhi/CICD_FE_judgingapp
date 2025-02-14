import {
  ActionIcon,
  Button,
  Center,
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
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { TCriteria } from "~/store/features/adminProjects/entity";

import classes from "./index.module.css";

interface RowData extends TCriteria {}

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

type Props = {
  data: RowData[];
  selection: number[];
  setSelection: React.Dispatch<React.SetStateAction<number[]>>;
  onHandleAllocate: () => void;
  onEdit: (item: RowData) => void;
  onDelete: (item: RowData) => void;
};
export default function Round2Table({ data, onDelete, onEdit }: Props) {
  const [sortedData, setSortedData] = useState(data);

  const rows = sortedData?.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.criteriaName}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>
        <Group>
          <Button variant="light" size="xs" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <ActionIcon variant="light" color="red" onClick={() => onDelete(row)}>
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
      <Paper>
        <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed">
          <Table.Tbody>
            <Table.Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th style={{ width: 200 }}>Action</Th>
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
