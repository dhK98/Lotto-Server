import { PickType } from "@nestjs/swagger";
import { PhoneAuth } from "../entities/phoneAuth";

export class RequestPhoneAuthDto extends PickType(PhoneAuth,["phonenumber"]) {}