import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class FindPasswordDto extends PickType(User,["email","password","phonenumber"]){}