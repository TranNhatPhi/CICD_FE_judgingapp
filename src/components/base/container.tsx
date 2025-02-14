import { Container, ContainerProps } from "@mantine/core";

type TContainerProps = {
  children: React.ReactNode;
} & ContainerProps;

export const BaseContainer = ({
  children,
  ...restOfProps
}: TContainerProps) => {
  return (
    <Container maw="md" {...restOfProps}>
      {children}
    </Container>
  );
};
