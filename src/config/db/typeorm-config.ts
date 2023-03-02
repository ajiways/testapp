import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { EEnv } from '../enums/env.enum';

type TruePostgresConnectionOptions = PostgresConnectionOptions & {
  // Без этого не подгружает entities, не знаю что делать (:
  autoLoadEntities: boolean;
};

const getBaseConfigPart = (): TruePostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(process.cwd(), '/dist/**/*.entity.js')],
  migrations: ['dist/migrations/*.js', 'dist/seeds/*.js'],
  migrationsTableName: 'migrations',
  autoLoadEntities: true,
  schema: 'public',
  logging: process.env.STAGE === EEnv.DEV ? true : false,
  synchronize: process.env.STAGE === EEnv.DEV ? true : false,
});

export default registerAs(
  'typeorm',
  function (): TruePostgresConnectionOptions {
    return getBaseConfigPart();
  },
);
