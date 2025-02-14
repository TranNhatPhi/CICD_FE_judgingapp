import {
  Button,
  Flex,
  Group,
  Modal,
  ModalBody,
  Select,
  Stepper,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import {
  useAddSchoolMutation,
  useAddSemesterMutation,
  useGetSchoolListQuery,
  useGetSemesterListQuery,
} from "~/store/features/adminProjects/api";
import { useSemesterInfo } from "~/store/features/adminProjects/selectors";

enum ActiveStep {
  selectSchool,
  selectSemester,
}
type Props = {
  opened: boolean;
  onClose: () => void;
};
const AdminSemesterModal = ({
  opened: isOpenedSemesterselection,
  onClose: toggleSemesterSelection,
}: Props) => {
  const { semesterId, schoolId, updateSchool, updateSemester } =
    useSemesterInfo();

  const { data: schoolList } = useGetSchoolListQuery({});

  useEffect(() => {
    if (semesterId === undefined || schoolId === undefined) return;
    if (
      (semesterId === null || schoolId === null) &&
      !isOpenedSemesterselection
    ) {
      toggleSemesterSelection();
    }
  }, [semesterId, schoolId, isOpenedSemesterselection]);

  const [active, setActive] = useState(ActiveStep.selectSchool);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [isAddingSemester, setIsAddingSemester] = useState(false);
  const [addSchool, { isLoading: isAddingSchoolMutation }] =
    useAddSchoolMutation();
  const [addSemester, { isLoading: isAddingSemesterMutation }] =
    useAddSemesterMutation();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      schoolId: "",
      semesterId: "",
      schoolName: "",
      semesterName: "",
      yearSemester: "",
      eventName: "",
      description: "",
    },
    validate: (values) => {
      if (active == ActiveStep.selectSchool && !isAddingSchool) {
        return {
          schoolId: values.schoolId == "" ? "School is required" : null,
        };
      }
      if (active == ActiveStep.selectSchool && isAddingSchool) {
        return {
          schoolName:
            values.schoolName == "" ? "School name is required" : null,
        };
      }
      if (active == ActiveStep.selectSemester && !isAddingSemester) {
        return {
          semesterId: values.semesterId == "" ? "Semester is required" : null,
        };
      }
      if (active == ActiveStep.selectSemester && isAddingSemester) {
        return {
          semesterName:
            values.semesterName == "" ? "Semester name is required" : null,
          yearSemester:
            values.yearSemester == "" ? "Year semester is required" : null,
        };
      }
      return {};
    },
  });

  const { data: semesterList } = useGetSemesterListQuery(form.values.schoolId, {
    skip: !form.values.schoolId,
  });

  const updateActive = () => {
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      if (current == ActiveStep.selectSemester) {
        if (!isAddingSemester) {
          updateSemester(
            semesterList?.find(
              (s) => s.id.toString() === form.values.semesterId,
            ),
          );
        }
        if (!isAddingSchool) {
          updateSchool(
            schoolList?.find((s) => s.id.toString() === form.values.schoolId),
          );
        }
        setIsAddingSchool(false);
        setIsAddingSemester(false);
        form.reset();
        toggleSemesterSelection();
        return ActiveStep.selectSchool;
      }
      return current + 1;
    });
  };
  const nextStep = async () => {
    if (active == ActiveStep.selectSchool && isAddingSchool) {
      try {
        const result = await addSchool({
          schoolName: form.values.schoolName,
        }).unwrap();
        updateSchool(result.data);
        form.setValues({ schoolId: result.data.id.toString() });
        updateActive();
        return;
      } catch (error) {
        console.error(error);
      }
    }
    if (active == ActiveStep.selectSemester && isAddingSemester) {
      try {
        const result = await addSemester({
          semesterName: form.values.semesterName,
          schoolId: Number(form.values.schoolId),
          yearSemester: form.values.yearSemester,
          eventName: form.values.eventName,
          description: form.values.description,
        }).unwrap();
        updateSemester(result.data);
        updateActive();
        return;
      } catch (error) {
        console.error(error);
      }
    }
    updateActive();
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Modal
      opened={isOpenedSemesterselection}
      onClose={() => {
        setIsAddingSchool(false);
        setIsAddingSemester(false);
        form.reset();
        setActive(ActiveStep.selectSchool);
        toggleSemesterSelection();
      }}
      title="Select school and semester"
      closeOnClickOutside={!!semesterId && !!schoolId}
      closeOnEscape={!!semesterId && !!schoolId}
      centered={true}
      withCloseButton={!!semesterId && !!schoolId}
    >
      <ModalBody>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="School" description="Select school">
            <Flex justify="end">
              <Button
                leftSection={!isAddingSchool ? <IconPlus /> : null}
                variant="outline"
                onClick={() => setIsAddingSchool((current) => !current)}
              >
                {isAddingSchool ? "Select school" : "Add school"}
              </Button>
            </Flex>
            {isAddingSchool ? (
              <TextInput
                label="School name"
                placeholder="Enter school name"
                key={form.key("schoolName")}
                {...form.getInputProps("schoolName")}
                required
              />
            ) : (
              <Select
                data={
                  schoolList?.map((s) => ({
                    value: s.id.toString(),
                    label: s.schoolName,
                  })) ?? []
                }
                label="School"
                placeholder="Select school"
                key={form.key("schoolId")}
                {...form.getInputProps("schoolId")}
                required
              />
            )}
            <Text size="xs" fs="italic" mt="sm">
              *You may want to add new school name if you cannot find it in the
              list
            </Text>
          </Stepper.Step>

          <Stepper.Step label="Semester" description="Select semester">
            <Flex justify="end">
              <Button
                leftSection={!isAddingSemester ? <IconPlus /> : null}
                variant="outline"
                onClick={() => setIsAddingSemester((prev) => !prev)}
              >
                {isAddingSemester ? "Select semester" : "Add semester"}
              </Button>
            </Flex>
            {isAddingSemester ? (
              <Flex direction="column" gap="sm">
                <TextInput
                  label="Semester name"
                  placeholder="Enter semester name"
                  key={form.key("semesterName")}
                  {...form.getInputProps("semesterName")}
                  required
                />
                <TextInput
                  label="Year semester"
                  placeholder="Enter year semester"
                  key={form.key("yearSemester")}
                  {...form.getInputProps("yearSemester")}
                  required
                  type="number"
                />
                <TextInput
                  label="Event title"
                  placeholder="Enter event title"
                  key={form.key("eventName")}
                  {...form.getInputProps("eventName")}
                  required
                />
                <Textarea
                  label="Description"
                  placeholder="Enter description"
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                />
              </Flex>
            ) : (
              <Select
                data={
                  semesterList?.map((s) => ({
                    value: s.id.toString(),
                    label: `${s.semesterName} - ${s.yearSemester}`,
                  })) ?? []
                }
                label="Semester"
                placeholder="Select semester"
                key={form.key("semesterId")}
                {...form.getInputProps("semesterId")}
                required
              />
            )}
            <Text size="xs" fs="italic" mt="sm">
              *You may want to add new semester if you cannot find it in the
              list
            </Text>
          </Stepper.Step>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== ActiveStep.selectSemester && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          <Button
            onClick={nextStep}
            loading={isAddingSchoolMutation || isAddingSemesterMutation}
          >
            {active != ActiveStep.selectSemester ? "Next" : "Confirm"}
          </Button>
        </Group>
      </ModalBody>
    </Modal>
  );
};
export default AdminSemesterModal;
