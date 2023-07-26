import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { RequestSMSFormat, RequestSMSFormat as SMS, SMSContentType, SMSMessage, SMSType } from 'src/types/SMS';
import CryptoJS from "crypto-js"
import Config from 'src/config/config';

@Injectable()
export class CommonService {
    async encryptionString(string: String){
        const result = await bcrypt.hash(string,10);
        return result;
    }

    async compareString(string1: String, string2: String){
        return bcrypt.compare(string1,string2);
    }

    async create6DigitRandomnumber(){
        return String(Math.floor(Math.random()*899999+100000));
    }

    async makeMessageFormat(message: string, subject:string, to: string){
        const messageFormat: SMSMessage = {
            to,
            subject,
            content: message,
        }
        return messageFormat
    }
    
    validatePhoneNumber(phonenumber: string): boolean{
        const phoneNumberFormat: RegExp = /^\d{11}$/;
        console.log(phonenumber)
        if(!phoneNumberFormat.test(phonenumber)){
            return false;
        }
        return true
    }

    makeSMSFormat(content: string, phoneNumber: string): RequestSMSFormat {
        const format: RequestSMSFormat = {
            type : SMSType.SMS,
            contentType: SMSContentType.COM,
            countryCode: '82',
            from: Config.smsCallingNumber,
            content,
            messages: [
                {to: phoneNumber}
            ]
          }
          return format
    }

    makeSMSSignature(timestamp: String){
        var space = " ";				// one space
        var newLine = "\n";				// new line
        var method = "POST";				// method
        var url = `/sms/v2/services/${Config.smsServiceID}/messages`;	// url (include query string)
        var accessKey = Config.smsAccess;			// access key id (from portal or Sub Account)
        var secretKey = Config.smsSecret;			// secret key (from portal or Sub Account)
    
        var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url);
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(accessKey);
    
        var hash = hmac.finalize();
    
        return hash.toString(CryptoJS.enc.Base64);
    }
}