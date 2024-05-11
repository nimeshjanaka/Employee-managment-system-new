import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { LeaveRequestStatus } from 'src/common/enum/common.enum';

@Controller('leave-request')
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  async create(
    @Res() response,
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
    @GetUser() user: User,
  ) {
    return await this.leaveRequestService.create(user, createLeaveRequestDto);
  }

  @Get()
  findAll() {
    return this.leaveRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveRequestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ) {
    return this.leaveRequestService.update(+id, updateLeaveRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveRequestService.remove(+id);
  }

  @Get('/pending')
  async getPendingLeaves(@Res() response, @GetUser() user: User) {
    const leaves = await this.leaveRequestService.findLeavesByStatus(
      user.id,
      LeaveRequestStatus.PENDING,
    );
    return response.status(HttpStatus.OK).json(leaves);
  }

  @Get('/rejected')
  async getRejectedLeaves(@Res() response, @GetUser() user: User) {
    const leaves = await this.leaveRequestService.findLeavesByStatus(
      user.id,
      LeaveRequestStatus.REJECTED,
    );
    return response.status(HttpStatus.OK).json(leaves);
  }

  @Get('/accepted')
  async getAcceptedLeaves(@Res() response, @GetUser() user: User) {
    const leaves = await this.leaveRequestService.findLeavesByStatus(
      user.id,
      LeaveRequestStatus.GRANTED,
    );
    return response.status(HttpStatus.OK).json(leaves);
  }
}