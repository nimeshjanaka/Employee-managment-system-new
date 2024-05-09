import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordResetDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  confirmPassword: string;
}
