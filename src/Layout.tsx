import { Flex } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

// type LayoutProps = {
//   children: ReactNode;
// };

const Layout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <Flex bg={"gray.2"} justify={"center"} w={"100%"} component="main">
      <Flex
        maw={440}
        mih={"100vh"}
        mah={"100%"}
        direction={"column"}
        w={"100%"}
      >
        <Outlet />
      </Flex>
    </Flex>
  );
};

export default Layout;
