import { ApiProperty } from "@nestjs/swagger";
import { PhoneAuth } from "../entities/phoneAuth";
import { AuthType } from "../entities/authType";

export class CheckPhoneAuthDto extends PhoneAuth{
    @ApiProperty({
        enum: AuthType,
        example: AuthType.SIGNUP,
        description: "인증 타입"
    })
    type: AuthType
}