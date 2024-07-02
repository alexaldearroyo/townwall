import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE posts (
      id serial PRIMARY KEY,
      user_id int NOT NULL,
      icon varchar(1),
      title varchar(255) NOT NULL,
      content text NOT NULL,
      category_id bigint,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      slug varchar(255) NOT NULL
    )
  `;

  await sql`
    CREATE
    OR REPLACE function update_posts_updated_at_column () returns trigger AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  await sql`
    CREATE TRIGGER update_posts_updated_at before
    UPDATE ON posts FOR each ROW
    EXECUTE procedure update_posts_updated_at_column ();
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TRIGGER if EXISTS update_posts_updated_at ON posts`;
  await sql`DROP FUNCTION if EXISTS update_posts_updated_at_column`;
  await sql`DROP TABLE posts`;
}
