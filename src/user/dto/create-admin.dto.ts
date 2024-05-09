import { Role } from 'src/role/entity/role.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsString({ message: 'firstName must be a string' })
  @IsNotEmpty({ message: 'firstName can not be empty' })
  firstName: string;

  @IsString({ message: 'lastName must be a string' })
  @IsNotEmpty({ message: 'lastName can not be empty' })
  lastName: string;

  @IsString({ message: 'nic must be a string' })
  @IsNotEmpty({ message: 'nic can not be empty' })
  nic: string;

  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'telNo can not be empty' })
  telNo: string;

  @IsString({ message: 'password must be a string' })
  @MinLength(4)
  @IsNotEmpty({ message: 'password can not be empty' })
  password: string;

  @IsNotEmpty()
  is_permanent: boolean;

  @IsNotEmpty()
  role: any;
}
