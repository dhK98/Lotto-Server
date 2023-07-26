import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './users/user.module';
import { CommonService } from './common/common.service';
import { RedisService } from './redis/redis.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, CommonService, RedisService],
})
export class AppModule {}
