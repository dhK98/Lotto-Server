import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CommonService } from 'src/common/common.service';
import { UserService } from 'src/users/user.service';
import { RedisService } from 'src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [CommonService,UserService,RedisService,JwtService,PrismaService]
})
export class AuthModule {}
