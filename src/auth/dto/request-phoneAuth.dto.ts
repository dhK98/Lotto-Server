import { ApiProperty, PickType } from "@nestjs/swagger";
import { PhoneAuth } from "../entities/phoneAuth";
import { AuthType } from "../entities/authType";

export class RequestPhoneAuthDto extends PickType(PhoneAuth,["phonenumber"]) {
    @ApiProperty({
        enum: AuthType,
        example: AuthType.SIGNUP,
        description: "인증 타입"
    })
    type: AuthType
}