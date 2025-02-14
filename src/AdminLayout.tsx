import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  AppShellSection,
  Avatar,
  Burger,
  Button,
  Divider,
  Flex,
  Image,
  NavLink,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
// import { Client } from "@stomp/stompjs";
import {
  IconCalendarEvent,
  IconKeyframeAlignCenter,
  // IconDashboard,
  IconLogout,
  IconPrompt,
  IconRocket,
  IconUsers,
} from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// import SockJS from "sockjs-client";
// import { setRound1 } from "~/store/features/adminProjects/slice";
// import { useAppDispatch } from "~/store/hook";
import AdminSemesterModal from "./components/layouts/AdminSemesterModal";
import { ADMIN_ROUTES } from "./router/routes";
import { useSemesterInfo } from "./store/features/adminProjects/selectors";
import {
  useLogout,
  useToken,
  useUserInfo,
} from "./store/features/auth/selectors";

// const SOCKET_URL = `${import.meta.env.VITE_API_ENDPOINT}/ws`;

const data = [
  { icon: IconPrompt, label: "Projects", key: "/projects" },
  {
    icon: IconUsers,
    label: "Judges",
    key: "/judges",
  },
  {
    icon: IconKeyframeAlignCenter,
    label: "Criteria",
    key: "/criteria",
  },
  {
    icon: IconCalendarEvent,
    label: "Current event",
    children: [
      {
        icon: IconCalendarEvent,
        label: "Round 1",
        key: "/round1",
      },
      // { icon: IconCalendarEvent, label: "Round 2", key: "/round2" },
      { icon: IconRocket, label: "Round 2", key: "/round/final" },
    ],
  },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const [active, setActive] = useState(pathname);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    setActive(pathname);
  }, [pathname]);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();

  const isMobile = useMediaQuery(`(max-width: 62em`);

  const navigateTo = (key: string) => {
    setActive(`/admin${key}`);
    navigate(`/admin${key}`);
    toggleMobile();
  };

  const token = useToken();
  const user = useUserInfo();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    navigate(`/admin/${ADMIN_ROUTES.LOGIN.path}`);
  };
  useEffect(() => {
    if (token === undefined) return;
    if (token === null) {
      navigate(`/admin/${ADMIN_ROUTES.LOGIN.path}`);
      return;
    }
    if (
      (token !== null && user?.role !== "[admin]") ||
      new Date((jwtDecode(token ?? "")?.exp ?? 0) * 1000) < new Date()
    ) {
      handleLogout();
    }
  }, [token, user?.role]);

  const { semesterName, schoolName, yearSemester } = useSemesterInfo();
  const [isOpenedSemesterselection, { toggle: toggleSemesterSelection }] =
    useDisclosure(false);
  return (
    <Flex bg={"gray.2"} justify={"center"} w={"100%"} pos={"relative"}>
      <AppShell
        header={{
          height: isMobile ? 60 : 0,
        }}
        navbar={{
          width: 300,
          breakpoint: "md",
          collapsed: {
            mobile: !mobileOpened,
          },
        }}
      >
        <AppShellHeader hiddenFrom="md" p="sm">
          <Flex justify="space-between" align="center" gap="md">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="md"
              size="sm"
            />
            {!mobileOpened ? (
              <Flex justify="center" align="center" gap="md" direction="column">
                <Flex gap="md" align="center">
                  <Avatar radius="xl" name={user.username ?? ""} />
                  <Text>{user?.username ?? ""}</Text>
                </Flex>
              </Flex>
            ) : (
              <></>
            )}
          </Flex>
        </AppShellHeader>
        <AppShellNavbar px="sm" py="md">
          <AppShellSection grow>
            <Flex justify="center" align="center" gap="sm" direction="column">
              <Image src={"/assets/uow_logo.svg"} alt="logo" maw="200px" />
              <Tooltip label="Click here to change school and semester">
                <Button
                  variant="light"
                  onClick={() => toggleSemesterSelection()}
                >
                  {schoolName} - {semesterName}, {yearSemester}
                </Button>
              </Tooltip>
              <Divider flex={1} w="100%" />

              {data.map((item) => (
                <NavLink
                  key={item.label}
                  active={
                    !item.children && `/admin${item.key}` === active
                    // (`/admin${item.key}` === active ||
                    //   `/admin${item?.key2}` === active)
                  }
                  label={item.label}
                  leftSection={<item.icon size="1rem" stroke={1.5} />}
                  onClick={() => !item.children && navigateTo(item.key)}
                  styles={{
                    collapse: {
                      width: "100%",
                    },
                  }}
                  defaultOpened={true}
                >
                  {item?.children
                    ? item.children.map((child) => (
                        <NavLink
                          key={child.label}
                          label={child.label}
                          active={`/admin${child.key}` === active}
                          leftSection={<child.icon size="1rem" stroke={1.5} />}
                          onClick={() => navigateTo(child.key)}
                          childrenOffset={20}
                        />
                      ))
                    : null}
                </NavLink>
              ))}
            </Flex>
          </AppShellSection>

          <AppShell.Section>
            <Divider flex={1} w="100%" mb="sm" />
            <Flex justify="center" align="center" gap="md" direction="column">
              <Flex gap="md" align="center">
                <Avatar radius="xl" name={user.username ?? ""} />
                <Text>{user?.username ?? ""}</Text>
              </Flex>

              <Button
                fullWidth
                variant="subtle"
                rightSection={<IconLogout />}
                onClick={handleLogout}
              >
                Log out
              </Button>
            </Flex>
          </AppShell.Section>
        </AppShellNavbar>
        <AppShellMain maw="1440" mt={""} w="100%">
          <Outlet />
        </AppShellMain>
      </AppShell>

      <AdminSemesterModal
        opened={isOpenedSemesterselection}
        onClose={toggleSemesterSelection}
      />
    </Flex>
  );
};

export default AdminLayout;
