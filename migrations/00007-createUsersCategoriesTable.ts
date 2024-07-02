import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users_categories (
      id serial PRIMARY KEY,
      user_id int NOT NULL,
      category_id int NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users_categories`;
}
