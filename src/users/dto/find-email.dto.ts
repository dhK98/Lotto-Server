import { PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class FindEmailDto extends PickType(User,["phonenumber"]){}