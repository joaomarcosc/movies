import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('movie')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('userId', 'uuid', (col) =>
      col.references('user.id').notNull().onDelete('cascade'),
    )
    .addColumn('title', 'varchar', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('images', sql`text[]`, (col) => col.notNull())
    .addColumn('rating', 'integer', (col) => col.notNull())
    .addColumn('isPublic', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('language', 'varchar', (col) => col.notNull())
    .addColumn('duration', 'integer', (col) => col.notNull())
    .addColumn('trailer', 'text', (col) => col.notNull())
    .addColumn('genres', sql`text[]`, (col) => col.notNull())
    .addColumn('budget', 'integer', (col) => col.notNull())
    .addColumn('revenue', 'integer', (col) => col.notNull())
    .addColumn('profit', 'integer', (col) => col.notNull())
    .addColumn('releaseDate', 'date', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('movie').execute();
}
