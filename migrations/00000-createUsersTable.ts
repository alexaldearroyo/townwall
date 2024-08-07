import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE EXTENSION if NOT EXISTS postgis
    WITH
      schema public;
  `;

  await sql`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      username varchar(255) NOT NULL UNIQUE,
      email varchar(255) NOT NULL UNIQUE,
      password_hash varchar(255) NOT NULL,
      profile_id serial UNIQUE,
      full_name text,
      description text,
      interests text,
      profile_links text,
      user_image varchar(255) NOT NULL,
      location geometry (POINT, 4326),
      birthdate date,
      profession text,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      slug varchar(255) NOT NULL UNIQUE
    )
  `;

  await sql`
    CREATE
    OR REPLACE function update_updated_at_column () returns trigger AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  await sql`
    CREATE TRIGGER update_users_updated_at before
    UPDATE ON users FOR each ROW
    EXECUTE function update_updated_at_column ();
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TRIGGER if EXISTS update_users_updated_at ON users`;
  await sql`DROP FUNCTION if EXISTS update_updated_at_column`;
  await sql`DROP TABLE IF EXISTS users`;
  await sql`DROP EXTENSION if EXISTS postgis`;
}
