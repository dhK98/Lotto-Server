import { BadRequestException, Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Post, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma }  from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthStatus } from 'src/auth/enum/authStatus';
import { FindEmailDto } from './dto/find-email.dto';
import { ResponseEmailDto } from './dto/response-email.dto';
import { FindPasswordDto } from './dto/find-password.dto';

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
            throw new ConflictException("already exist phonenumber");
        }
        const key = this.redisService.makeSignupAuthenticationKey(user.phonenumber);
        const isAuth = await this.redisService.get(key);
        if(isAuth === null || isAuth !== AuthStatus["completed"]){
            throw new UnauthorizedException("Authentication is not completed");
        }
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
            throw new ConflictException("already exist account")
        }
        const isExistName = await this.userService.findUserWithName(user.name);
        if(isExistName !== null){
            throw new ConflictException("already exist name")
        }
        // 4. Get encryption function of common service 
        const encryptionPassword = await this.commonService.encryptionString(user.password);
        const storeUser: Prisma.UserCreateInput = {
            ...user,
            password: encryptionPassword,
        }
        // 5. Call createUser of userService
        const createdUSer = await this.userService.createUser(storeUser)
        await this.redisService.del(key);
        return new ResponseUserDto(createdUSer);
    }

    @ApiBody({type: FindEmailDto})
    @ApiResponse({type: ResponseEmailDto})
    @ApiOperation({
        summary: "이메일 찾기",
        description: "휴대폰 번호 인증 후, 이메일 조회"
    })
    @Post("/email")
    async findEmailWithPhonenumber(@Body() user: FindEmailDto){
        if (!user.phonenumber || !this.commonService.validatePhoneNumber(user.phonenumber)){
            throw new BadRequestException("phone number format is not valid.")
        }
        const isExistPhonenumber = await this.userService.findUserWithPhonenumber(user.phonenumber);
        if(isExistPhonenumber === null){
            throw new NotFoundException("no exist signedup user");
        }
        // 1. validate SMS auth
        const key = this.redisService.makeFindEmailAuthenticationKey(user.phonenumber);
        const isAuth = await this.redisService.get(key);
        if(isAuth === null || isAuth!==AuthStatus["completed"]){
            throw new  UnauthorizedException("this phonenumber isn`t get auth");
        }
        // 2. find email with phonenumber
        await this.redisService.del(key);
        return new ResponseEmailDto(isExistPhonenumber.email);
    }
    @ApiBody({type: FindPasswordDto})
    @ApiOperation({
        summary: "패스워드 변경",
        description: "휴대폰 번호 인증 후, 패스워드 변경"
    })
    @Post("/password")
    async updatePassword(@Body() user:FindPasswordDto){
        if (!user.phonenumber || !this.commonService.validatePhoneNumber(user.phonenumber)){
            throw new BadRequestException("phone number format is not valid.")
        }
        if(!this.commonService.validateEmail(user.email)){
            throw new BadRequestException("Email format is not valid.")
        }
        if(!this.commonService.validatePassword(user.password)){
            throw new BadRequestException("Password format is not valid.")
        }
        const key = this.redisService.makeFindPasswordAuthenticationKey(user.phonenumber);
        const isAuth = await this.redisService.get(key);
        if(isAuth === null || isAuth!==AuthStatus["completed"]){
            throw new  UnauthorizedException("this phonenumber isn`t get auth");
        }
        const isExistUser = await this.userService.findUserWithPhonenumber(user.phonenumber);
        if(!isExistUser){
            throw new NotFoundException("no exist user");
        }
        if(isExistUser.email !== user.email){
            throw new NotFoundException("not equal user email")
        }
        const encryptionPassword = await this.commonService.encryptionString(user.password);
        try {
            await this.userService.updateUser(isExistUser.id,{...isExistUser,password: encryptionPassword});
        } catch (error) {
            throw new InternalServerErrorException();
        }
        await this.redisService.del(key);
        return {message: true};
    }
}
