import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async createUser(data: Prisma.UserCreateInput): Promise<UserModel>{
        return this.prisma.user.create({
            data
        })
    }

    async findUserWithEmail(email: string){
        return this.prisma.user.findFirst({
            where: {email: email}
        })
    }
}
