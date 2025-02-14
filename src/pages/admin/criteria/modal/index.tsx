import { Button, Flex, Modal, ModalBody, Paper, Text } from "@mantine/core";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  projects: { groupName: string; title: string }[];
};
const SelectProjectsToRound2Modal = ({ isOpen, onClose, projects }: Props) => {
  return (
    <Modal
      title="Confirm projects into round 2"
      opened={isOpen}
      onClose={onClose}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <ModalBody>
        <Flex direction="column" gap="md">
          <Flex direction="column">
            <Text size="lg" fw={500}>
              Projects
            </Text>
            <Flex wrap="wrap" gap="md">
              {projects?.map((project) => (
                <Paper key={project.title} p="md" radius="md" withBorder>
                  <Text size="sm" fw={500}>
                    {project.title}
                  </Text>
                  <Text size="sm" c="gray">
                    {project.groupName}
                  </Text>
                </Paper>
              ))}
            </Flex>
          </Flex>

          <Button>Submit</Button>
        </Flex>
      </ModalBody>
    </Modal>
  );
};
export default SelectProjectsToRound2Modal;
