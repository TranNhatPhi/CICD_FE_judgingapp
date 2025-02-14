import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  rem,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Dropzone, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconFileSpreadsheet, IconUpload, IconX } from "@tabler/icons-react";
import { omit } from "lodash";
import { useState } from "react";

import AdminProctedBodyLayout from "~/components/layouts/AdminProtectedBodyLayout";
import ProjectTable from "~/components/table";
import {
  useAddProjectsMutation,
  useGetProjectListQuery,
  useRemoveProjectByIdMutation,
  useUpdateProjectByIdMutation,
  // useUploadProjectsMutation,
} from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";
import { formatBytes } from "~/utils/format";

// import classes from "./index.module.css";

export default function AdminProjectList() {
  const { semesterId } = useSemesterInfo();
  const {
    data: projectList,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch,
  } = useGetProjectListQuery(semesterId, {
    skip: !semesterId,
    refetchOnMountOrArgChange: true,
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [openedImport, { open: openImport, close: closeImport }] =
    useDisclosure(false);
  const [addProject, { isLoading: isAddingProject }] = useAddProjectsMutation();
  // const [addProjectsByFile, { isLoading: isAddingProjectsByFile }] =
  //   useUploadProjectsMutation();
  const [isAddingProjectsByFile, setIsAddingProjectsByFile] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [updateProject, { isLoading: isUpdatingProject }] =
    useUpdateProjectByIdMutation();

  const [removeProject, { isLoading: isRemovingProject }] =
    useRemoveProjectByIdMutation();
  const form = useForm<{
    id: number | null;
    groupName: string;
    title: string;
    description: string;
    client: string;
  }>({
    mode: "controlled",
    initialValues: {
      id: null,
      groupName: "",
      title: "",
      description: "",
      client: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (values?.id) {
        await updateProject({
          ...values,
          id: values!.id.toString() as string,
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Project updated successfully",
          color: "green",
        });
      } else {
        await addProject({
          id: semesterId,
          body: [omit(values, "id")],
        }).unwrap();
        notifications.show({
          title: "Success",
          message: "Project added successfully",
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

  const handleSubmitImport = async () => {
    console.log("file", file);
    const bodyFormData = new FormData();
    bodyFormData.append("file", file as File);
    // console.log({ bodyFormData, file });
    try {
      // await addProjectsByFile({
      //   id: semesterId,
      //   body: bodyFormData,
      // }).unwrap();
      // const binaryData = await readFileAsBinary(file as File);
      // bodyFormData.append("file", new Blob([binaryData]));
      // await addProjectsByFile({
      //   id: semesterId,
      //   body: bodyFormData,
      // }).unwrap();
      setIsAddingProjectsByFile(true);
      await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/projects/import/${semesterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ContentType: "multipart/form-data",
          },
          body: bodyFormData,
          method: "POST",
        },
      );
      notifications.show({
        title: "Success",
        message: "Projects added successfully",
        color: "green",
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: (error as { data: { message: string } })?.data?.message ?? "",
        color: "red",
      });
    } finally {
      setIsAddingProjectsByFile(false);
      setFile(null);
      closeImport();
    }
  };

  return (
    <AdminProctedBodyLayout
      title="All Projects"
      loadingOverlay={isListLoading || isListFetching}
      action={{
        label: "Add Project",
        onClick: open,
      }}
      action2={{
        label: "Import Projects",
        onClick: openImport,
      }}
    >
      <ProjectTable
        data={projectList}
        onEdit={(item) => {
          form.setValues(item);
          open();
        }}
        onDelete={(item) => {
          modals.open({
            size: "sm",
            title: "Delete project",
            children: (
              <>
                <Text size="sm">
                  Are you sure you want to delete project <b>{item.title}</b>?
                </Text>
                <Box ta="end" mt="lg">
                  <Button
                    ta="center"
                    loading={isRemovingProject}
                    color="red"
                    onClick={async () => {
                      try {
                        await removeProject({
                          id: item.id.toString(),
                        }).unwrap();
                        notifications.show({
                          title: "Success",
                          message: "Project deleted successfully",
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
        onClose={close}
        title={form.values?.id ? "Edit project" : "Add project"}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column" gap="sm">
            <TextInput
              {...form.getInputProps("groupName")}
              label="Group Name"
              withAsterisk
              key={form.key("groupName")}
              required
            />
            <TextInput
              {...form.getInputProps("title")}
              label="Project Title"
              withAsterisk
              key={form.key("title")}
              required
            />
            <Textarea
              {...form.getInputProps("description")}
              label="Description"
              withAsterisk
              key={form.key("description")}
              required
            />
            <TextInput
              {...form.getInputProps("client")}
              label="Client"
              key={form.key("client")}
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

      <Modal
        opened={openedImport}
        onClose={() => {
          closeImport();
        }}
        title={"Import projects"}
        size="lg"
      >
        <Dropzone
          onDrop={(files) => setFile(files[0])}
          onReject={(files) =>
            notifications.show({
              title: "Error",
              message: `File ${files[0]?.file?.name} is not a valid excel file or exceeds the size limit`,
              color: "red",
            })
          }
          maxSize={20 * 1024 ** 2}
          accept={MS_EXCEL_MIME_TYPE}
          disabled={isAddingProjectsByFile}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-blue-6)",
                }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: "var(--mantine-color-red-6)",
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFileSpreadsheet
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: file
                    ? "var(--mantine-color-blue-4)"
                    : "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>
            {file ? (
              <Flex direction="column" align={"center"}>
                <Flex direction="column" align={"center"}>
                  <Text size="lg" c="blue">
                    {file.name}
                  </Text>
                  <div>{formatBytes(file.size)}</div>
                </Flex>

                <Text size="xs" fs="italic">
                  *You can drag and drop or click again to upload a new file
                </Text>
              </Flex>
            ) : (
              <div>
                <Text size="xl" inline>
                  Drag a file (.xlsx) here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attached file should not exceed 20mb
                </Text>
              </div>
            )}
          </Group>
        </Dropzone>

        <Flex justify={"center"} mt="md">
          <Button
            size="lg"
            onClick={handleSubmitImport}
            loading={isAddingProjectsByFile}
          >
            Submit
          </Button>
        </Flex>
      </Modal>
    </AdminProctedBodyLayout>
  );
}
