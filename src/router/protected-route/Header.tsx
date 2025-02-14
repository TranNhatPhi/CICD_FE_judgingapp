import { Button, Flex, Menu, Paper, Text } from "@mantine/core";
import { IconChevronLeft, IconUser } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppConfig } from "~/store/features/adminProjects/selectors";
import { useLogout, useUserInfo } from "~/store/features/auth/selectors";

import { ROUTES } from "../routes";
import { findTitleByPath } from "../utils";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onNavigateHome = () => navigate(ROUTES.HOME.path as string);
  const logout = useLogout();
  const { username } = useUserInfo();
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN.path as string);
  };

  const { eventName } = useAppConfig();

  const renderLeftHeading = () => {
    if (location.pathname === ROUTES.HOME.path) {
      return (
        <Text
          variant="gradient"
          gradient={{
            from: "#0036D0",
            to: "#B31010",
            deg: 45,
          }}
          style={{ fontSize: 28 }}
          fw={800}
        >
          {eventName ?? ""}
        </Text>
      );
    }

    return (
      <Button
        onClick={onNavigateHome}
        variant="transparent"
        size="compact-xl"
        color="dark"
        leftSection={<IconChevronLeft />}
      >
        {findTitleByPath(location.pathname)}
      </Button>
    );
  };

  const renderRightHeading = () => {
    return (
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            leftSection={<IconUser />}
            variant="default"
            size="compact-xl"
            color="dark"
          >
            {username}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };
  return (
    <Paper
      bg={"white"}
      px={"md"}
      py={"lg"}
      w={"100%"}
      shadow="xs"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Flex justify={"space-between"}>
        {renderLeftHeading()}
        {renderRightHeading()}
      </Flex>
    </Paper>
  );
};

export default Header;
