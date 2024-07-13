import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users_categories (
      id serial PRIMARY KEY,
      user_id int NOT NULL REFERENCES users (id),
      category_id int NOT NULL REFERENCES categories (id)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users_categories`;
}
