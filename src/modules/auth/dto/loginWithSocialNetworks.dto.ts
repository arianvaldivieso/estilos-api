import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginWithSocialNetworkDto {
    @ApiProperty({ type: String })
    @IsEmail()
    @IsString()
    readonly email: string;
}
