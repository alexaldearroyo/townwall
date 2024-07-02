import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE comments (
      id serial PRIMARY KEY,
      content text NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE
    OR REPLACE function update_comments_updated_at_column () returns trigger AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  await sql`
    CREATE TRIGGER update_comments_updated_at before
    UPDATE ON comments FOR each ROW
    EXECUTE procedure update_comments_updated_at_column ();
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TRIGGER if EXISTS update_comments_updated_at ON comments`;
  await sql`DROP FUNCTION if EXISTS update_comments_updated_at_column`;
  await sql`DROP TABLE comments`;
}
