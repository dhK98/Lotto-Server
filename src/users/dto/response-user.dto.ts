import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class ResponseUserDto extends PickType(User,["email","name","phonenumber"]){
    constructor(user:User){
        super()
        this.email = user.email;
        this.name = user.name;
        this.phonenumber = user.phonenumber;
    }
}