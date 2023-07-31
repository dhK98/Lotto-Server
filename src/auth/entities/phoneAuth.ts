import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";

export class PhoneAuth extends PickType(User,["phonenumber"]) {
    @ApiProperty({
        type: String,
        example: "123456",
        description: "인증번호",
    })
    authnumber: string;
}