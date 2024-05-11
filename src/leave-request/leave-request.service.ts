import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequestStatus } from 'src/common/enum/common.enum';
import { LeaveRequest } from './entity/leave-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(user: User, createLeaveRequestDto: CreateLeaveRequestDto) {
    const suggestedCoworker = await this.userRepository.findOne({
      where: {
        id: createLeaveRequestDto.SuggestedCoworkerId,
      },
    });

    if (!suggestedCoworker) {
      throw new NotFoundException('Suggested Coworker not found');
    }

    const { formDate, toDate, reason } = createLeaveRequestDto;
    const leaveRequest = new LeaveRequest();
    leaveRequest.fromDate = formDate;
    leaveRequest.toDate = toDate;
    leaveRequest.reason = reason;
    leaveRequest.SuggestedCoworker = suggestedCoworker;
    leaveRequest.status = LeaveRequestStatus.PENDING;
    leaveRequest.employee = user;
    return await this.leaveRequestRepository.save(leaveRequest);
  }

  findAll() {
    return `This action returns all leaveRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveRequest`;
  }

  update(id: number, updateLeaveRequestDto: UpdateLeaveRequestDto) {
    return `This action updates a #${id} leaveRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveRequest`;
  }

  async findLeavesByStatus(
    userId: number,
    status: LeaveRequestStatus,
  ): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: {
        employee: { id: userId },
        status: status,
      },
      relations: ['employee'],
    });
  }
}