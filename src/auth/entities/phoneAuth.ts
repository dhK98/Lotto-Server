import { ApiProperty } from "@nestjs/swagger";

export class PhoneAuth {
    @ApiProperty({
        type: String,
        example: "01045099894",
        description: "휴대폰 번호"
    })
    phonenumber: string;

    @ApiProperty({
        type: String,
        example: "123456",
        description: "인증번호",
    })
    authnumber: string;
}