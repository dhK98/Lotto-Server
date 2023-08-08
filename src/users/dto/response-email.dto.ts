import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class ResponseEmailDto extends PickType(User,["email"]){
    constructor(email: string){
        super();
        this.email = email;
    }
}