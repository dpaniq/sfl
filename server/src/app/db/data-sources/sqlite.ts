import {DataSource} from 'typeorm';

export const db = new DataSource({
  name: 'default',
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: ['src/app/data/entities/**/*.entity.ts', '**/*.entity.ts', './*.entity.ts'],
  migrations: ['src/app/data/migrations/**/*.ts'],
  subscribers: ['src/app/data/subscribers/**/*.subscriber.ts'],
  // TODO
  // cli: {
  //   entitiesDir: 'src/app/data/entities',
  //   migrationsDir: 'src/app/data/migrations',
  //   subscribersDir: 'src/app/data/subscribers',
  // },
});
