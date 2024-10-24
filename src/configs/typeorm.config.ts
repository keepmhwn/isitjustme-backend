import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');
export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: `${dbConfig.password}`,
  database: 'isitjustme',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
