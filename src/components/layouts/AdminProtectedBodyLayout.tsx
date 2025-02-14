import { Button, Flex, LoadingOverlay, Text } from "@mantine/core";
import { ReactNode } from "react";

const AdminProctedBodyLayout = ({
  title,
  children,
  loadingOverlay,
  action,
  action2,
}: {
  title: string;
  children: ReactNode;
  loadingOverlay?: boolean;
  action?: { label: string; onClick: () => void };
  action2?: { label: string; onClick: () => void };
}) => {
  return (
    <Flex direction="column" gap="sm" py="md" miw={"100%"}>
      <Flex justify="space-between" align="center">
        <Text component="h1" fw={700} size="xl">
          {title}
        </Text>
        <Flex gap="sm">
          {action && (
            <Button
              color="blue"
              onClick={action.onClick}
              style={{ cursor: "pointer" }}
            >
              {action.label}
            </Button>
          )}
          {action2 && (
            <Button
              color="green"
              onClick={action2.onClick}
              style={{ cursor: "pointer" }}
            >
              {action2.label}
            </Button>
          )}
        </Flex>
      </Flex>
      {children}

      <LoadingOverlay
        visible={loadingOverlay}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "pink", type: "oval" }}
      />
      {/* ...other content */}
    </Flex>
  );
};
export default AdminProctedBodyLayout;
