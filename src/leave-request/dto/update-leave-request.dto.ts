import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveRequestDto } from './create-leave-request.dto';
import { IsValidEnum, LeaveRequestStatus } from 'src/common/enum/common.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLeaveRequestDto extends PartialType(CreateLeaveRequestDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsValidEnum(LeaveRequestStatus)
  status: LeaveRequestStatus;
}
