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

    async findUserWithId(id: string){
        return await this.prisma.user.findUnique({
            where: {id: id}
        })
    }

    async findUserWithEmail(email: string){
        return await this.prisma.user.findUnique({
            where: {email: email}
        })
    }

    async findUserWithName(name: string){
        return await this.prisma.user.findUnique({
            where: {name: name}
        })
    }  

    async findUserWithPhonenumber(phonenumber: string){
        return await this.prisma.user.findUnique({
            where: {phonenumber: phonenumber}
        })
    }

    async updateUser(id:string,data:Prisma.UserUpdateInput){
        return await this.prisma.user.update({
            where: {id},
            data: data,
        })
    }
}
