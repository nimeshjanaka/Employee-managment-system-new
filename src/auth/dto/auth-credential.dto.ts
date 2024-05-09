import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(22)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  password: string;
}
