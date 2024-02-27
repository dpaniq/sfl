import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_CONNECTION } from './constants';
import { AuthModule } from './entities/auth';
import { UsersModule } from './entities/users';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_DB_CONNECTION),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
