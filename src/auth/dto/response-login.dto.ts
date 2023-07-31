import { ApiProperty, PickType } from "@nestjs/swagger"
import { User } from "src/users/entities/user.entity"

export class UserInfo extends PickType(User,["name","phonenumber"]){} 

export class ResponseLoginDto {
    constructor(access_token:string, refresh_token:string, name: string, phonenumber: string){
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.user = {name, phonenumber};
    }
    @ApiProperty({
        type: String,
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiL2Zvby9iYXIvZXhhbXBsZS5tcDQiLCJleHAiOjE2NzI0NTU2MDAsIm5iZiI6MTY2OTI1ODgwMCwiY2lwIjoiMTkyLjE2OC4yMDAuMC8yNCJ9.65cikBSh0rsrH1-2Q87HSK7v3-KExYe-B1wpaTZTQ2o",
        description: "Access Token"
    })
    access_token: string

    @ApiProperty({
        type: String,
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiL2Zvby9iYXIvZXhhbXBsZS5tcDQiLCJleHAiOjE2NzI0NTU2MDAsIm5iZiI6MTY2OTI1ODgwMCwiY2lwIjoiMTkyLjE2OC4yMDAuMC8yNCJ9.65cikBSh0rsrH1-2Q87HSK7v3-KExYe-B1wpaTZTQ2o",
        description: "Refresh Token"
    })
    refresh_token: string

    @ApiProperty({
        type: UserInfo,
    })
    user: UserInfo
}

