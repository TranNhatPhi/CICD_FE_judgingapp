import { Flex, Text } from "@mantine/core";

const Footer = () => {
  return (
    <Flex p={"md"} bg={"white"} justify={"center"}>
      <Text>Judging App @ {new Date().getFullYear()}</Text>
    </Flex>
  );
};

export default Footer;
