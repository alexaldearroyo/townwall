import { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE categories (
      id serial PRIMARY KEY,
      category_name varchar(255) NOT NULL UNIQUE,
      description text
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE categories`;
}
