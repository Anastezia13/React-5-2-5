import { Anchor, Box, Button, Group, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <Box className={styles.header}>
      <Group justify="space-between">
        <Group gap="xs">
          <Box className={styles.logoCircle}>hh</Box>
          <Text size="lg" fw={500} c="dimmed" className={styles.logoText}>FrontEnd</Text>
        </Group>

        <Group gap="xl">
          <Anchor component={Link} to="/vacancies" className={styles.menuLink}>
            Вакансии FE
          </Anchor>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<IconUser size={16} />}
            className={styles.menuButton}
          >
            Обо мне
          </Button>
        </Group>
      </Group>
    </Box>
  );
};
