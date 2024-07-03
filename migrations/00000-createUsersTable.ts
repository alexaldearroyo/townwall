import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      username varchar(255) NOT NULL,
      email varchar(255),
      password_hash varchar(255) NOT NULL,
      full_name text,
      description text,
      profile_id bigint,
      user_image varchar(255),
      location POINT,
      birthdate date,
      profession text,
      links text,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;
  // make email not null!

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
    EXECUTE procedure update_updated_at_column ();
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TRIGGER if EXISTS update_users_updated_at ON users`;
  await sql`DROP FUNCTION if EXISTS update_updated_at_column`;
  await sql`DROP TABLE IF EXISTS users`;
}
