import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthForgotPasswordDto {
  @IsNotEmpty({ message: 'Username is can not empty' })
  @IsString()
  @IsEmail()
  username: string;
}
