import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ type: String })
    @IsString()
    readonly password: string;

    @ApiProperty({ type: Boolean })
    @IsBoolean()
    isError: boolean;
}
