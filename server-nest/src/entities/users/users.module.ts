import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileLoggerService } from 'src/shared/services/logger.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, FileLoggerService],
})
export class UsersModule {}
