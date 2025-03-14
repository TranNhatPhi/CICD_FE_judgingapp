import {
  Button,
  Flex,
  Image,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconLockOpen, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import { LoginFormErrors } from "~/pages/auth/utils/schema";
import { useLoginMutation } from "~/store/features/auth/api";
import { setAuth } from "~/store/features/auth/slice";
import { useAppDispatch } from "~/store/hook";

const LoginPage = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: LoginFormErrors,
  });
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: typeof form.values) => {
    console.log("values", values);
    try {
      const result = await login(values).unwrap();
      await dispatch(setAuth(result));
      navigate(`/admin/projects`);
    } catch (error) {
      console.log("error", error);
      modals.open({
        centered: true,
        size: "xs",
        title: "Login Error",
        children: (
          <>
            <Text>Your username or password is incorrect!</Text>
            <Button fullWidth onClick={() => modals.closeAll()} mt="md">
              I understand
            </Button>
          </>
        ),
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction={"column"} gap={"xl"}>
        <Flex direction={"column"} justify={"center"} align={"center"} gap="lg">
          <Image src={"/assets/uow_logo.svg"} alt="logo" />
          <Text
            size="xl"
            fw={700}
            variant="gradient"
            gradient={{
              from: "#0036D0",
              to: "#B31010",
              deg: 45,
            }}
          >
            Nhat phi
          </Text>
        </Flex>
        <Flex direction={"column"} gap={"md"}>
          <TextInput
            label="Username"
            size="lg"
            leftSectionPointerEvents="none"
            leftSection={<IconUser />}
            withAsterisk
            placeholder="Enter username"
            key={form.key("username")}
            {...form.getInputProps("username")}
          ></TextInput>
          <PasswordInput
            label="Password"
            size="lg"
            leftSectionPointerEvents="none"
            leftSection={<IconLockOpen />}
            withAsterisk
            placeholder="Enter password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          ></PasswordInput>
        </Flex>
        <Button size="lg" fullWidth m="auto" type="submit" loading={isLoading}>
          Login
        </Button>
      </Flex>
    </form>
  );
};
export default LoginPage;
