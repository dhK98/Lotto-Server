import { BadRequestException, Body, Controller, Post, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma }  from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthStatus } from 'src/auth/enum/authStatus';

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly commonService: CommonService,
        private readonly redisService: RedisService,
        ){}

    @Post()
    @ApiBody({type: CreateUserDto})
    @ApiResponse({type: ResponseUserDto})
    @ApiOperation({
        summary: "회원가입",
        description: "이메일, 패스워드, 이름, 휴대폰번호 입력 후 회원가입(휴대폰 인증 완료 후)"
    })
    async createUser(@Body() user: CreateUserDto): Promise<ResponseUserDto>{
        // 1. Check this email is Auth?
        if (!user.phonenumber || !this.commonService.validatePhoneNumber(user.phonenumber)){
            throw new BadRequestException("phone number format is not valid.")
        }
        const isExistPhonenumber = await this.userService.findUserWithPhonenumber(user.phonenumber);
        if(isExistPhonenumber !== null){
            throw new UnprocessableEntityException("already exist phonenumber");
        }
        const key = this.redisService.makePhoneAuthenticationKey(user.phonenumber);
        const isAuth = await this.redisService.get(key);
        if(isAuth === null || isAuth !== AuthStatus["completed"]){
            throw new UnprocessableEntityException("Authentication is not completed");
        }
        await this.redisService.del(key);
        if(!this.commonService.validateEmail(user.email)){
            throw new BadRequestException("Email format is not valid.")
        }
        if(!this.commonService.validatePassword(user.password)){
            throw new BadRequestException("Password format is not valid.")
        }
        if(!this.commonService.validateName(user.name)){
            throw new BadRequestException("name format is not valid.")
        }
        const isExistEmail = await this.userService.findUserWithEmail(user.email);
        if(isExistEmail !== null){
            throw new UnprocessableEntityException("already exist account")
        }
        const isExistName = await this.userService.findUserWithName(user.name);
        if(isExistName !== null){
            throw new UnprocessableEntityException("already exist name")
        }
        // 4. Get encryption function of common service 
        const encryptionPassword = await this.commonService.encryptionString(user.password);
        const storeUser: Prisma.UserCreateInput = {
            ...user,
            password: encryptionPassword,
        }
        // 5. Call createUser of userService
        const createdUSer = await this.userService.createUser(storeUser)
        return new ResponseUserDto(createdUSer);
    }
}
