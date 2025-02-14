import { Flex, Image } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useToken } from "~/store/features/auth/selectors";
const AuthLayout = ({ redirectTo = "/" }) => {
  const { width } = useViewportSize();
  const maxWidth = Math.min(440, width);
  const token = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (token === undefined) return;
    if (token) {
      navigate(redirectTo);
    }
  }, [token]);

  return (
    <Fragment>
      <Flex
        style={{ zIndex: 1, position: "relative" }}
        h={"100%"}
        align="center"
        justify={"center"}
      >
        <Outlet />
      </Flex>
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
    </Fragment>
  );
};
export default AuthLayout;
