import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto {
    @ApiProperty({ type: Boolean })
    isError: boolean;

    @ApiProperty({ type: Number })
    code: number;

    @ApiProperty({ type: String })
    message: string;
}
