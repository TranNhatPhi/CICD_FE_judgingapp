import {
  Box,
  Button,
  Flex,
  Modal,
  rem,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconJoinRound } from "@tabler/icons-react";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import AdminProctedBodyLayout from "~/components/layouts/AdminProtectedBodyLayout";
import {
  useAddCriteriaMutation,
  useDeleteCriteriaMutation,
  useGetCriteriaListQuery,
  useUpdateCriteriaMutation,
} from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";

import Round2Table from "./table";

const AdminRound2 = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({ tab: searchParams?.get("tab") ?? "projects" });
  }, []);

  const [selection, setSelection] = useState<number[]>([]);

  const { semesterId } = useSemesterInfo();
  const {
    data,
    isLoading: isLoadingList,
    refetch,
  } = useGetCriteriaListQuery(semesterId, {
    skip: !semesterId,
    refetchOnMountOrArgChange: true,
  });
  const [editCriteria, { isLoading: isEditingCriteria }] =
    useUpdateCriteriaMutation();
  const [deleteCriteria, { isLoading: isDeletingCriteria }] =
    useDeleteCriteriaMutation();
  const [addCriteria, { isLoading: isAddingCriteria }] =
    useAddCriteriaMutation();

  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<{
    id: number | null;
    criteriaName: string;
    description: string;
  }>({
    mode: "controlled",
    initialValues: {
      id: null,
      criteriaName: "",
      description: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (values?.id) {
        await editCriteria({
          body: omit(values, "id"),
          id: values!.id.toString() as string,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Criteria updated successfully",
          color: "green",
        });
      } else {
        await addCriteria({
          id: semesterId,
          body: omit(values, "id"),
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Criteria added successfully",
          color: "green",
        });
      }
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: (error as { data: { message: string } })?.data?.message ?? "",
        color: "red",
      });
    } finally {
      form.reset();
      close();
    }
  };
  return (
    <AdminProctedBodyLayout
      title="Criteria"
      loadingOverlay={isLoadingList}
      action={{
        label: "Add criteria",
        onClick: () => {
          form.reset();
          open();
        },
      }}
    >
      <Tabs
        value={(searchParams.get("tab") || "projects") as string}
        onChange={(value) => {
          setSearchParams({ tab: value as string });
        }}
      >
        <Tabs.List bg="white" mb="sm">
          <Tabs.Tab
            value="projects"
            leftSection={<IconJoinRound style={iconStyle} />}
          >
            Current criteria
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="projects">
          <Round2Table
            data={data ?? []}
            selection={selection}
            setSelection={setSelection}
            onHandleAllocate={() => {}}
            onEdit={(criteria) => {
              form.setValues(criteria);
              open();
            }}
            onDelete={(item) => {
              modals.open({
                size: "sm",
                title: "Delete judge",
                children: (
                  <>
                    <Text size="sm">
                      Are you sure you want to delete criteria{" "}
                      <b>{item.criteriaName}</b>?
                    </Text>
                    <Box ta="end" mt="lg">
                      <Button
                        ta="center"
                        loading={isDeletingCriteria}
                        color="red"
                        onClick={async () => {
                          try {
                            await deleteCriteria({
                              id: item.id.toString(),
                            }).unwrap();
                            notifications.show({
                              title: "Success",
                              message: "Criteria deleted successfully",
                              color: "red",
                            });
                            refetch();
                          } catch (error) {
                            notifications.show({
                              title: "Error",
                              message:
                                (error as { data: { message: string } })?.data
                                  ?.message ?? "",
                              color: "red",
                            });
                          } finally {
                            modals.closeAll();
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </>
                ),
              });
            }}
          />
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={opened}
        onClose={close}
        title={form.values?.id ? "Edit criteria" : "Add criteria"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column" gap="sm">
            <TextInput
              {...form.getInputProps("criteriaName")}
              label="Criteria Name"
              withAsterisk
              key={form.key("criteriaName")}
              required
            />

            <Textarea
              {...form.getInputProps("description")}
              label="Description"
              withAsterisk
              key={form.key("description")}
              required
            />

            <Button
              type="submit"
              size="md"
              mt="md"
              loading={isAddingCriteria || isEditingCriteria}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
    </AdminProctedBodyLayout>
  );
};
export default AdminRound2;
