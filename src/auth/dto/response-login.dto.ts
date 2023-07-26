import { ApiProperty } from "@nestjs/swagger"

export class ResponseLoginDto {
    constructor(access_token:string){
        this.access_token = access_token
    }
    @ApiProperty({
        type: String,
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjoiL2Zvby9iYXIvZXhhbXBsZS5tcDQiLCJleHAiOjE2NzI0NTU2MDAsIm5iZiI6MTY2OTI1ODgwMCwiY2lwIjoiMTkyLjE2OC4yMDAuMC8yNCJ9.65cikBSh0rsrH1-2Q87HSK7v3-KExYe-B1wpaTZTQ2o",
        description: "로그인 토큰"
    })
    access_token: string
}