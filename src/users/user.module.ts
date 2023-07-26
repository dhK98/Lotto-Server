import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommonService } from 'src/common/common.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService,CommonService,RedisService]
})
export class UserModule {}
