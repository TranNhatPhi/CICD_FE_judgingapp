import { Card, Grid, Text } from "@mantine/core";

type ProjectInfoCardProps = {
  title: string;
  groupName: string;
  abstract: string;
};
const ProjectInfoCard = ({
  title,
  groupName,
  abstract,
}: ProjectInfoCardProps) => {
  return (
    <Card radius="lg" padding="lg">
      <Card.Section inheritPadding withBorder py="sm">
        <Text size="xl" fw={700}>
          {title}
        </Text>
      </Card.Section>
      <Card.Section inheritPadding py="sm">
        <Grid>
          <Grid.Col span={4}>
            <Text size="sm" c="gray.7">
              Group
            </Text>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{groupName}</Text>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Card.Section inheritPadding py="sm">
        <Text size="md" fw={600}>
          Abstract
        </Text>
        <Text c="gray.8">{abstract}</Text>
      </Card.Section>
    </Card>
  );
};
export default ProjectInfoCard;
