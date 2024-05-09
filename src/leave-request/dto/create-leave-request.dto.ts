import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
    IsValidEnum,
  LeaveRequestStatus,
} from 'src/common/enum/common.enum';
import { User } from 'src/user/entity/user.entity';

export class CreateLeaveRequestDto {
  @IsNotEmpty()
  fromDate: Date;

  @IsNotEmpty()
  toDate: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;

//   @IsNotEmpty()
//   @IsValidEnum(LeaveRequestStatus)
//   status: LeaveRequestStatus;

//   employee: User;

  @IsNotEmpty()
  @IsNumber()
  SuggestedCoworkerId: number;
}
