export enum SMSType {
    SMS = "SMS",
    LMS = "LMS",
    MMS = "MMS",
}

export enum SMSContentType {
    COM = "COMM",
    AD = "AD"
}

export type SMSMessage =  {
    to: string,
    subject?: string,
    content?: string,
}

type Files = {
    fileId: string,
}

export type RequestSMSFormat = {
    // 이메일 타입
    type: SMSType;
    contentType?: SMSContentType;
    countryCode: string,
    from: string,
    subject?: string,
    content: string,
    messages?: [SMSMessage],
    files? : [Files],
    reserveTime?: string,
    reserveTimeZone?: string,
}

