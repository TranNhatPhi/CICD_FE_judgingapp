import {
  Button,
  Flex,
  Modal,
  ModalBody,
  MultiSelect,
  Paper,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import { useGetProjectListQuery } from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  judges: { name: string }[];
  onSubmit: (judges: string[]) => void;
  loading?: boolean;
  projectIds: string[];
};
const AllocateJudgesModal = ({
  isOpen,
  onClose,
  judges,
  onSubmit,
  loading,
  projectIds,
}: Props) => {
  const { semesterId } = useSemesterInfo();
  const { data: projectList, isLoading: isListLoading } =
    useGetProjectListQuery(semesterId, {
      skip: !semesterId,
      refetchOnMountOrArgChange: true,
    });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      projects: projectIds,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values.projects);
  };

  useEffect(() => {
    if (!form.isDirty("projects")) {
      form.setValues({ projects: projectIds });
    }
  }, [projectIds]);

  return (
    <Modal
      title="Allocate Judges"
      opened={isOpen}
      onClose={() => {
        form.setValues({ projects: [] });
        form.setDirty({ projects: false });
        onClose();
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <ModalBody>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column" gap="md">
            <Flex direction="column">
              <Text size="lg" fw={500}>
                Judges
              </Text>
              <Flex wrap="wrap" gap="md">
                {judges?.map((project) => (
                  <Paper key={project.name} p="md" radius="md" withBorder>
                    <Text size="sm" fw={500}>
                      {project.name}
                    </Text>
                  </Paper>
                ))}
              </Flex>
            </Flex>

            <MultiSelect
              label="Available projects"
              placeholder="select project(s) here"
              searchable
              data={
                projectList?.map((item) => ({
                  value: item.id.toString(),
                  label: `${item.groupName} - ${item.title}`,
                })) ?? []
              }
              nothingFoundMessage="No projects found..."
              {...form.getInputProps("projects")}
              key={form.key("projects")}
            />

            <Button loading={isListLoading || loading} type="submit">
              Submit
            </Button>
          </Flex>
        </form>
      </ModalBody>
    </Modal>
  );
};
export default AllocateJudgesModal;
