import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // вообще не работает glob у typeorm, не знаю что делать (:
  entities: [],
  migrations: [],
  migrationsTableName: 'migrations',
  schema: 'public',
  logging: false,
});
