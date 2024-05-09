import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { LeaveRequestStatus } from 'src/common/enum/common.enum';
import { LeaveRequest } from './entity/leave-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: User, createLeaveRequestDto: CreateLeaveRequestDto) {
    console.log(createLeaveRequestDto);

    const suggestedCoworker = await this.userRepository.findOne({
      where: {
        id: createLeaveRequestDto.SuggestedCoworkerId,
      },
    });

    if (!suggestedCoworker) {
      throw new NotFoundException('Suggested Coworker not found');
    }

    const { fromDate, toDate, reason } = createLeaveRequestDto;
    const leaveRequest = new LeaveRequest();
    leaveRequest.fromDate = fromDate;
    leaveRequest.toDate = toDate;
    leaveRequest.reason = reason;
    leaveRequest.SuggestedCoworker = suggestedCoworker;
    leaveRequest.status = LeaveRequestStatus.PENDING;
    leaveRequest.employee = user;
    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async findAll(status: string, options: IPaginationOptions) {
    let statusEnum: LeaveRequestStatus;

    switch (status.toUpperCase()) {
      case 'PENDING':
        statusEnum = LeaveRequestStatus.PENDING;
        break;

      case 'GRANTED':
        statusEnum = LeaveRequestStatus.GRANTED;
        break;

      case 'REJECTED':
        statusEnum = LeaveRequestStatus.REJECTED;
        break;

      default:
        statusEnum = LeaveRequestStatus.PENDING;
        break;
    }

    return paginate<LeaveRequest>(this.leaveRequestRepository, options, {
      where: {
        status: statusEnum,
      },
      relations: {
        employee: true,
        SuggestedCoworker: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllForUser(
    status: string,
    user: User,
    options: IPaginationOptions,
  ) {
    let statusEnum: LeaveRequestStatus;

    switch (status.toUpperCase()) {
      case 'PENDING':
        statusEnum = LeaveRequestStatus.PENDING;
        break;

      case 'GRANTED':
        statusEnum = LeaveRequestStatus.GRANTED;
        break;

      case 'REJECTED':
        statusEnum = LeaveRequestStatus.REJECTED;
        break;

      default:
        statusEnum = LeaveRequestStatus.PENDING;
        break;
    }

    return paginate<LeaveRequest>(this.leaveRequestRepository, options, {
      where: {
        status: statusEnum,
        employee: {
          id: user.id,
        },
      },
      relations: {
        employee: true,
        SuggestedCoworker: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllForCoworker(
    status: string,
    user: User,
    options: IPaginationOptions,
  ) {
    let statusEnum: LeaveRequestStatus;

    switch (status.toUpperCase()) {
      case 'PENDING':
        statusEnum = LeaveRequestStatus.PENDING;
        break;

      case 'GRANTED':
        statusEnum = LeaveRequestStatus.GRANTED;
        break;

      case 'REJECTED':
        statusEnum = LeaveRequestStatus.REJECTED;
        break;

      default:
        statusEnum = LeaveRequestStatus.PENDING;
        break;
    }

    return paginate<LeaveRequest>(this.leaveRequestRepository, options, {
      where: {
        status: statusEnum,
        SuggestedCoworker: {
          id: user.id,
        },
      },
      relations: {
        employee: true,
        SuggestedCoworker: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        employee: true,
        SuggestedCoworker: true,
      },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request Not Found');
    }

    return leaveRequest;
  }

  async update(
    id: number,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
    user: User,
  ): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: {
        id: id,
        employee: {
          id: user.id,
        },
      },
      relations: {
        employee: true,
        SuggestedCoworker: true,
      },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave Request Not Found');
    }

    if (leaveRequest.status != LeaveRequestStatus.PENDING) {
      throw new ForbiddenException(
        `Leave Request Already ${leaveRequest.status} by administrator, Please contact administrator`,
      );
    }

    const coworker = await this.userRepository.findOneBy({
      id: updateLeaveRequestDto.SuggestedCoworkerId,
    });

    if (!coworker) {
      throw new NotFoundException('Suggested Coworker Not Found');
    }

    delete updateLeaveRequestDto.status;
    leaveRequest.SuggestedCoworker = coworker;
    this.leaveRequestRepository.merge(leaveRequest, updateLeaveRequestDto);
    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async updateByAdmin(
    id: number,
    updateLeaveRequestDto: UpdateLeaveRequestDto,
  ) {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        employee: true,
        SuggestedCoworker: true,
      },
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave Request Not Found');
    }

    const coworker = await this.userRepository.findOneBy({
      id: updateLeaveRequestDto.SuggestedCoworkerId,
    });

    if (!coworker) {
      throw new NotFoundException('Suggested Coworker Not Found');
    }

    leaveRequest.status = updateLeaveRequestDto.status;
    leaveRequest.SuggestedCoworker = coworker;
    return await this.leaveRequestRepository.save(leaveRequest);
  }

  remove(id: number) {
    return `This action removes a #${id} leaveRequest`;
  }
}
