import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El campo firstName no puede estar vacío' })
  @IsString({ message: 'El campo firstName debe ser una cadena de texto' })
  firstName: string;

  @IsNotEmpty({ message: 'El campo lastName no puede estar vacío' })
  @IsString({ message: 'El campo lastName debe ser una cadena de texto' })
  lastName: string;

  @IsNotEmpty({ message: 'El campo email no puede estar vacío' })
  @IsEmail({}, { message: 'El formato del campo email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'El campo password no puede estar vacío' })
  @IsString({ message: 'El campo password debe ser una cadena de texto' })
  password: string;

  @IsNotEmpty({ message: 'El campo isActive no puede estar vacío' })
  @IsBoolean({ message: 'El campo isActive debe ser un valor booleano' })
  isActive: boolean;
}
