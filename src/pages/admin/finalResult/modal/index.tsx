import { Button, Flex, Modal, ModalBody, Text } from "@mantine/core";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};
const SelectProjectsToRound2Modal = ({ isOpen, onClose }: Props) => {
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
            <Text>ssss</Text>
          </Flex>

          <Button>Submit</Button>
        </Flex>
      </ModalBody>
    </Modal>
  );
};
export default SelectProjectsToRound2Modal;
