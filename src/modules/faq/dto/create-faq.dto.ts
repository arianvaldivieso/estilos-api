import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsUrl()
  @IsNotEmpty()
  url_video: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
