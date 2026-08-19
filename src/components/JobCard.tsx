import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { Job } from '../types';
import styles from './JobCard.module.css';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const formatMap: Record<string, string> = {
    remote: 'Можно удалённо',
    office: 'Офис',
    hybrid: 'Гибрид',
  };

  const formatColor: Record<string, string> = {
    remote: 'green',
    hybrid: 'yellow',
    office: 'gray',
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card}>
      <Stack gap="sm">
        <Text size="lg" fw={700}>{job.name}</Text>

        <Group gap="sm">
          <Text fw={500} c="green">{job.salary || 'з/п не указана'}</Text>
          <Text c="dimmed">•</Text>
          <Text c="dimmed">{job.experience || 'опыт не указан'}</Text>
        </Group>

        <Group gap="sm">
          {job.format && (
            <Badge color={formatColor[job.format] || 'gray'}>
              {formatMap[job.format] || job.format}
            </Badge>
          )}
        </Group>

        <Group gap="sm">
          <Text fw={500}>{job.company_name}</Text>
          <Text c="dimmed">•</Text>
          <Text c="dimmed">{job.city || 'город не указан'}</Text>
        </Group>

        <Button
          component={Link}
          to={`/vacancies/${job.id}`}
          variant="outline"
          color="blue"
          className={styles.viewButton}
        >
          Смотреть вакансию
        </Button>
      </Stack>
    </Card>
  );
};
