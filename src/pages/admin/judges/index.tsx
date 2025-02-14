import {
  Box,
  Button,
  Flex,
  Modal,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { omit } from "lodash";

import AdminProctedBodyLayout from "~/components/layouts/AdminProtectedBodyLayout";
import {
  useCreateJudgeAccountMutation,
  useDownloadExcelFileMutation,
  useGetJudgeListQuery,
  useRemoveUserAccountMutation,
  useUpdateJudgeAccountMutation,
} from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";

import JudgeTable from "./JudgeTable";

// import classes from "./index.module.css";

export default function AdminJudgeList() {
  const { semesterId } = useSemesterInfo();
  const {
    data: judgeList,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch,
  } = useGetJudgeListQuery(semesterId, {
    skip: !semesterId,
    refetchOnMountOrArgChange: true,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [createJudge, { isLoading: isAddingProject }] =
    useCreateJudgeAccountMutation();
  const [updateJudge, { isLoading: isUpdatingProject }] =
    useUpdateJudgeAccountMutation();

  const [removeJudge, { isLoading: isRemovingJudge }] =
    useRemoveUserAccountMutation();

  const [exportExcel] = useDownloadExcelFileMutation();
  const form = useForm<{
    id: number | null;
    account: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    description?: string;
  }>({
    mode: "controlled",
    initialValues: {
      id: null,
      account: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      description: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (values?.id) {
        await updateJudge({
          body: values,
          id: values!.id.toString() as string,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Judge updated successfully",
          color: "green",
        });
      } else {
        await createJudge({
          body: omit(values, "id"),
          id: semesterId,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Judge added successfully",
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
      title="All Judges"
      loadingOverlay={isListLoading || isListFetching}
      action={{
        label: "Add Judge",
        onClick: open,
      }}
      action2={{
        label: "Download",
        onClick: async () => {
          try {
            await exportExcel({
              setupId: semesterId,
              name: semesterId,
            }).unwrap();
          } catch (error) {
            notifications.show({
              title: "Error",
              message:
                (error as { data: { message: string } })?.data?.message ?? "",
              color: "red",
            });
          }
        },
      }}
    >
      <JudgeTable
        data={judgeList}
        onEdit={(item) => {
          form.setValues(item);
          open();
        }}
        onDelete={(item) => {
          modals.open({
            size: "sm",
            title: "Delete judge",
            children: (
              <>
                <Text size="sm">
                  Are you sure you want to delete judge <b>{item.firstName}</b>?
                </Text>
                <Box ta="end" mt="lg">
                  <Button
                    ta="center"
                    loading={isRemovingJudge}
                    color="red"
                    onClick={async () => {
                      try {
                        await removeJudge(item.id.toString()).unwrap();
                        notifications.show({
                          title: "Success",
                          message: "Judge deleted successfully",
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

      <Modal
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title={form.values?.id ? "Edit judge" : "Add judge"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column" gap="sm">
            <TextInput
              {...form.getInputProps("account")}
              label="Username"
              withAsterisk
              placeholder="Enter username"
              key={form.key("account")}
              required
            />
            <Flex gap="sm">
              <TextInput
                flex={1}
                {...form.getInputProps("firstName")}
                label="First Name"
                withAsterisk
                placeholder="Enter first name"
                key={form.key("firstName")}
                required
              />
              <TextInput
                flex={1}
                {...form.getInputProps("lastName")}
                label="Last Name"
                withAsterisk
                placeholder="Enter last name"
                key={form.key("lastName")}
                required
              />
            </Flex>
            <Flex gap="sm">
              <TextInput
                flex={1}
                {...form.getInputProps("email")}
                label="Email"
                type="email"
                withAsterisk
                key={form.key("email")}
                required
              />
              <TextInput
                flex={1}
                {...form.getInputProps("phone")}
                label="Phone"
                type="tel"
                withAsterisk
                key={form.key("phone")}
              />
            </Flex>
            <Textarea
              {...form.getInputProps("description")}
              label="Description"
              key={form.key("description")}
            />

            <Button
              type="submit"
              size="md"
              mt="md"
              loading={isAddingProject || isUpdatingProject}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
    </AdminProctedBodyLayout>
  );
}
