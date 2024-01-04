import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray, IsOptional } from "class-validator";

export class CreateRolDto {
    @ApiProperty({ type: String })
    @IsString()
    readonly name: string;
}
