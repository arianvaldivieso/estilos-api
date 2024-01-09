import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
