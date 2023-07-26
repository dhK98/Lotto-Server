import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty({
        type: String,
        example: "asdasd#1cdk",
        description: "식별자"
    })
    id: string;

    @ApiProperty({
        type: String,
        example:"test@naver.com",
        description: "이메일"
    })
    email: string;

    @ApiProperty({
        type: String,
        example: "12Sqecd34!",
        description: "패스워드"
    })
    password: string;

    @ApiProperty({
        type: String,
        example: "hello",
        description: "이름"
    })
    name: string;

    @ApiProperty({
        type: String,
        example: "01000000000",
        description: "휴대폰번호"
    })
    phonenumber: string

    @ApiProperty({
        type: Boolean,
        example: true,
        default: false,
        description: "휴대폰 인증여부"
    })
    email_authentication: boolean
}
