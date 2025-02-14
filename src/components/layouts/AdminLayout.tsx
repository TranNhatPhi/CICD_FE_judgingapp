import { em, Flex, Image, Paper } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useToken } from "~/store/features/auth/selectors";
const AdminAuthLayout = ({ redirectTo = "/admin/round1" }) => {
  const { width } = useViewportSize();
  const maxWidth = Math.min(440, width);
  const token = useToken();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  useEffect(() => {
    if (token === undefined) return;
    if (token) {
      navigate(redirectTo);
    }
  }, [token]);

  return isMobile ? (
    <Flex
      style={{ zIndex: 1, position: "relative" }}
      h={"100%"}
      mih={"100vh"}
      align="center"
      justify={"center"}
    >
      <Image
        src={"/assets/uow_bg.png"}
        style={{
          position: "absolute",
          bottom: 0,
          right: `calc(50% - ${maxWidth / 2})`,
          width: "100%",
          maxWidth,
          minHeight: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      <Flex style={{ zIndex: 1 }}>
        <Outlet />
      </Flex>
    </Flex>
  ) : (
    <Flex
      style={{ zIndex: 1, position: "relative" }}
      h={"100%"}
      mih={"100vh"}
      align="center"
      justify={"center"}
      bg="gray.1"
    >
      <Paper radius="lg" style={{ overflow: "hidden" }} bg="white">
        <Flex
          style={{ zIndex: 1, position: "relative" }}
          align="center"
          justify={"center"}
        >
          <Image
            src={"/assets/uow_bg.png"}
            style={{
              width: "100%",
              maxWidth,
              minHeight: "100%",
              objectFit: "cover",
            }}
          />
          <Flex style={{ zIndex: 1 }} px="xl">
            <Outlet />
          </Flex>
        </Flex>
      </Paper>
    </Flex>
  );
};
export default AdminAuthLayout;
