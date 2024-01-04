import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({ type: String })
    message: string;

    @ApiProperty({ type: Number })
    statusCode: number;

    @ApiProperty({ type: String })
    data?: string | any;
}
