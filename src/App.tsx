import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  MantineProvider,
  Pagination,
  Stack,
  Text,
  TextInput,
  createTheme,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { Filters } from './components/Filters';
import { Header } from './components/Header';
import { JobCard } from './components/JobCard';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { fetchJobs } from './store/jobsSlice';
import {
  addSkill,
  hydrateFilters,
  removeSkill,
  setCity,
  setPage,
  setSearch,
  type FiltersState,
} from './store/filtersSlice';
import '@mantine/core/styles.css';
import styles from './App.module.css';

const theme = createTheme({
  primaryColor: 'blue',
});

const getFiltersFromUrl = (params: URLSearchParams): FiltersState => {
  const requestedPage = Number(params.get('page'));
  const skills = (params.get('skills') ?? '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);

  return {
    search: params.get('search') ?? '',
    city: params.get('city') ?? 'Все',
    skills: [...new Set(skills)],
    page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };
};

const areFiltersEqual = (left: FiltersState, right: FiltersState) =>
  left.search === right.search &&
  left.city === right.city &&
  left.page === right.page &&
  left.skills.length === right.skills.length &&
  left.skills.every((skill, index) => skill === right.skills[index]);

const getUrlFromFilters = ({ search, city, skills, page }: FiltersState) => {
  const params = new URLSearchParams();

  if (search) params.set('search', search);
  if (city !== 'Все') params.set('city', city);
  if (skills.length > 0) params.set('skills', skills.join(','));
  if (page > 1) params.set('page', String(page));

  return params;
};

const VacanciesPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, pages } = useAppSelector((state) => state.jobs);
  const filters = useAppSelector((state) => state.filters);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const [debouncedSearch] = useDebouncedValue(filters.search, 300);
  const initialUrlFiltersRef = useRef(getFiltersFromUrl(searchParams));
  const isHydratingFromUrlRef = useRef(true);
  const skillsKey = filters.skills.join('\u0000');

  useEffect(() => {
    // При прямом открытии ссылки query-параметры становятся значениями фильтров.
    dispatch(hydrateFilters(initialUrlFiltersRef.current));
  }, [dispatch]);

  useEffect(() => {
    // Первый рендер ожидает, пока Redux примет значения из URL. Это защищает
    // query-параметры от перезаписи начальными значениями по умолчанию.
    if (isHydratingFromUrlRef.current) {
      if (areFiltersEqual(filters, initialUrlFiltersRef.current)) {
        isHydratingFromUrlRef.current = false;
      }
      return;
    }

    const nextParams = getUrlFromFilters({ ...filters, search: debouncedSearch });
    if (nextParams.toString() !== queryString) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filters, debouncedSearch, queryString, setSearchParams, skillsKey]);

  useEffect(() => {
    void dispatch(fetchJobs());
  }, [dispatch, filters.search, filters.city, skillsKey, filters.page]);

  if (loading && items.length === 0) {
    return (
      <>
        <Header />
        <Container size="xl" style={{ paddingTop: 32 }}>
          <Center style={{ minHeight: 400 }}>
            <Loader size="xl" />
          </Center>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container size="xl" style={{ paddingTop: 32 }}>
          <Alert color="red" title="Ошибка">
            {error}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container size="xl" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <Group className={styles.topRow} wrap="nowrap">
          <Box className={styles.titleWrapper}>
            <Text className={styles.titleMain}>Список вакансий</Text>
            <Text className={styles.titleSub}>по профессии Frontend-разработчик</Text>
          </Box>
          <Group gap="xs" className={styles.searchGroup}>
            <TextInput
              placeholder="Поиск по названию или компании..."
              value={filters.search}
              onChange={(event) => dispatch(setSearch(event.currentTarget.value))}
              leftSection={<IconSearch size={16} />}
              className={styles.searchInput}
            />
            <Button variant="filled" color="blue">Найти</Button>
          </Group>
        </Group>

        <Group className={styles.mainRow} align="flex-start">
          <Box className={styles.leftColumn}>
            <Filters
              search={filters.search}
              city={filters.city}
              skills={filters.skills}
              onSearchChange={(value) => dispatch(setSearch(value))}
              onCityChange={(value) => dispatch(setCity(value))}
              onAddSkill={(skill) => dispatch(addSkill(skill))}
              onRemoveSkill={(skill) => dispatch(removeSkill(skill))}
            />
          </Box>
          <Box className={styles.rightColumn}>
            {loading && (
              <Center mb="md">
                <Loader size="sm" />
              </Center>
            )}
            <Stack gap="md">
              {items.length > 0 ? (
                items.map((job) => <JobCard key={job.id} job={job} />)
              ) : (
                <Alert color="blue" title="Вакансии не найдены" variant="light">
                  Попробуйте изменить строку поиска или выбранные фильтры.
                </Alert>
              )}
            </Stack>

            {pages > 0 && (
              <Center style={{ marginTop: 24 }}>
                <Pagination
                  total={pages}
                  value={filters.page}
                  onChange={(value) => dispatch(setPage(value))}
                />
              </Center>
            )}
          </Box>
        </Group>
      </Container>
    </>
  );
};

function App() {
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Navigate to="/vacancies" replace />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/vacancies/:id" element={<JobDetailsPage />} />
        <Route path="*" element={<Navigate to="/vacancies" replace />} />
      </Routes>
    </MantineProvider>
  );
}

export default App;
