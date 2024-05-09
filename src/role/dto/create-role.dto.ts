import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'role must be a string' })
  @IsNotEmpty({ message: 'role can not be empty' })
  role: string;
}
