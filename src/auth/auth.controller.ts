import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { CommonService } from 'src/common/common.service';
import Config from 'src/config/config';
import { RedisService } from 'src/redis/redis.service';
import { RequestSMSFormat } from 'src/types/SMS';
import { UserService } from 'src/users/user.service';
import { CheckPhoneAuthDto } from './dto/check-phoneAuth.dto';
import { RequestPhoneAuthDto } from './dto/request-phoneAuth.dto';
import { LoginUser } from './dto/request-login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseLoginDto } from './dto/response-login.dto';
import { AuthStatus } from './enum/authStatus';


@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private userService: UserService, private readonly commonService: CommonService,private readonly redisService: RedisService, private readonly jwtService:JwtService) {}

  @Post('login')
  @ApiBody({type: LoginUser})
  @ApiResponse({type: ResponseLoginDto})
  @ApiOperation({
    summary: "로그인",
    description: "email과 password를 이용하여 로그인"
  })
  async login(@Body() loginInfo: LoginUser): Promise<ResponseLoginDto>{
    const storedUser = await this.userService.findUserWithEmail(loginInfo.email)
    if(!storedUser){
      throw new UnprocessableEntityException('not exist user');
    }
    if(!this.commonService.compareString(loginInfo.password,storedUser.password)){
      throw new UnprocessableEntityException('not equal password');
    }
    // create jwt token
    const payload = {sub: storedUser.id};
    const accessToken = await this.jwtService.signAsync(payload);
    return new ResponseLoginDto(accessToken);
  }

  @Post('/request')
  @ApiBody({type: RequestPhoneAuthDto})
  @ApiOperation({
    summary: "휴대폰 인증 요청",
    description: "휴대폰 번호로 6자리 인증번호 요청"
  })
  async phoneAuthenticationRequest(@Body() auth:RequestPhoneAuthDto){
    // 1. check phoneNumber format
    if(!this.commonService.validatePhoneNumber(auth.phonenumber)){
      throw new BadRequestException('phonenumber is not validate')
    }
    // 2. make a requestSMSFormat
    const randomNumber = await this.commonService.create6DigitRandomnumber();
    const content = `[service name] \n 인증번호: ${randomNumber}\n 제한시간 5분내에 인증번호를 입력해주세요.`;
    const timestamp = Date.now().toString();	
    const signature = this.commonService.makeSMSSignature(timestamp)
    const data: RequestSMSFormat = this.commonService.makeSMSFormat(content,auth.phonenumber);
    // 3. call API with axios
    //   await axios({
    //   method: "post",
    //   url: `${Config.smsURL}/${Config.smsServiceID}/messages`,
    //   headers: {
    //     "Contenc-type": "application/json; charset=utf-8",
    //       "x-ncp-iam-access-key": Config.smsAccess,
    //       "x-ncp-apigw-timestamp": timestamp,
    //       "x-ncp-apigw-signature-v2": signature,
    //   },
    //   data
    // }).catch((error)=>{
    //   console.log(error)
    //   throw new InternalServerErrorException(`error: ${error}`)
    // })
    try {
      const key = this.redisService.makePhoneAuthenticationKey(auth.phonenumber);
      await this.redisService.set5minute(key,randomNumber);
    } catch (error) {
      throw new InternalServerErrorException(`error: ${error}`);
    }
    return {message: true}
  }

  @Post('check')
  @ApiBody({type: CheckPhoneAuthDto})
  @ApiOperation({
    summary: "휴대폰 인증번호 확인",
    description: "입력한 휴대폰 번호가 유효한지 확인 이후 해당 휴대폰 번호로 로그인 진행"
  })
  async phoneAuthenticationCheck(@Body() auth: CheckPhoneAuthDto){
    try {
      const key = this.redisService.makePhoneAuthenticationKey(auth.phonenumber);
      const value = await this.redisService.get(key);
      console.log(auth.phonenumber)
      if(value !== auth.authnumber || value === null){
        return {message: false}
      } 
      await this.redisService.set5minute(key,AuthStatus["completed"]);
      return {message: true}
    }catch(error){
      throw new UnprocessableEntityException(`error: ${error}`)
    }
  }
}
