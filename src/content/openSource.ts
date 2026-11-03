import type { OpenSourceContribution } from '@/types/content';

/**
 * Open Source Contributions Store
 * Factual, verified code contributions with direct repository evidence.
 * Retains only verified pull requests.
 */
export const OPEN_SOURCE_CONTRIBUTIONS: OpenSourceContribution[] = [
  {
    id: 'duckdb-engine-pr-1407',
    repository: 'Mause/duckdb_engine',
    repositoryUrl: 'https://github.com/Mause/duckdb_engine',
    title: 'Add SQLModel primary key compatibility documentation',
    description:
      'Provided documented reference patterns and verified code examples demonstrating how to configure composite primary keys when pairing SQLModel with DuckDB SQLAlchemy engines.',
    prUrl: 'https://github.com/Mause/duckdb_engine/pull/1407',
    prNumber: 1407,
    type: 'documentation',
    status: 'open',
    date: '2026-10-29',
  },
];
