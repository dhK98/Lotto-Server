import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import Config from 'src/config/config';

@Injectable()
export class RedisService {
    private redis: Redis;
    constructor(){
        this.redis = new Redis({
            host: Config.redisHost,
            port: Config.redisPort,
            password: Config.redisPassword,
        });
    }

    async set5minute(key:string, value:string|number){
        return await this.redis.set(key,value,"EX",300);
    }

    async get(key:string){
        return await this.redis.get(key);
    }

    async del(key:string){
        return await this.redis.del(key);
    }

    makeSignupAuthenticationKey(phonenumber:string){
        return `signup_phone:${phonenumber}`;
    }

    makeFindEmailAuthenticationKey(phonenumber: string){
        return `findemail_phone:${phonenumber}`;
    }

    makeFindPasswordAuthenticationKey(phonenumber: string){
        return `findpassword_phone:${phonenumber}`;
    }

}
