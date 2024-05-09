import { Role } from 'src/role/entity/role.entity';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  inTime: string;

  outTime: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  task: string;

  description: string;
}
