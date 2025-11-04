import 'reflect-metadata';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
require('dotenv').config();

const database: TypeOrmModuleOptions = {
  type: 'postgres',
  entities: ['dist/database/entity/*/*{.ts,.js}'],
  migrations: ['dist/database/migration/*{.ts,.js}'],
  connectTimeoutMS: 60000, // 60 seconds,
  logging: true,
  autoLoadEntities: true,
  host: <string>process.env.DB_HOST,
  port: parseInt((<string>process.env.DB_PORT) as string, 10),
  username: <string>process.env.DB_USER,
  password: <string>process.env.DB_PASSWORD,
  database: <string>process.env.DB_NAME,
  // synchronize: <string>process.env.MEDTECH_ENV === 'development',
  synchronize: true,
};

export default () => ({
  port: Number(process.env.PORT) || 3000,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
  },
  database,
});
