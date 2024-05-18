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
import { MailerService } from 'src/mailer/mailer.service';
import { response } from 'express';

@Injectable()
export class LeaveRequestService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailerService,
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

    const { fromDate, toDate, reason } = createLeaveRequestDto;
    const leaveRequest = new LeaveRequest();
    leaveRequest.fromDate = fromDate;
    leaveRequest.toDate = toDate;
    leaveRequest.reason = reason;
    leaveRequest.SuggestedCoworker = suggestedCoworker;
    leaveRequest.status = LeaveRequestStatus.PENDING;
    leaveRequest.employee = user;
    const result = await this.leaveRequestRepository.save(leaveRequest);
    const mailResponse = await this.sendMailToManager(user, leaveRequest);
    return result;
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
      id:
        updateLeaveRequestDto.SuggestedCoworkerId ??
        leaveRequest.SuggestedCoworker.id,
    });

    console.log(coworker);

    if (!coworker) {
      throw new NotFoundException('Suggested Coworker Not Found');
    }

    leaveRequest.status = updateLeaveRequestDto.status;
    leaveRequest.SuggestedCoworker = coworker;
    const result = await this.leaveRequestRepository.save(leaveRequest);

    const mailReponseToEmployee = await this.sendMailToEmployee(leaveRequest);

    if (leaveRequest.status == LeaveRequestStatus.GRANTED) {
      const mailReponseToSuggestedCoworker =
        await this.sendMailToSuggestedCoworker(leaveRequest);
    }

    return result;
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

  async sendMailToManager(user: User, leaveRequest: LeaveRequest) {
    const { fromDate, toDate, reason, SuggestedCoworker } = leaveRequest;
    const response = await this.mailService.sendEmail({
      to: [
        {
          name: 'Admin',
          address: 'admin@me.com',
        },
      ],
      subject: `Request for leave`,
      html: `<h1>Leave Requested By ${user.firstName} ${user.lastName}</h1> <br/> From : ${fromDate} <br/> To : ${toDate} <br/> Reason : ${reason} <br/> Sugested Coworker : ${SuggestedCoworker.firstName} ${SuggestedCoworker.lastName}`,
    });
    return response;
  }

  async sendMailToEmployee(leaveRequest: LeaveRequest) {
    const response = await this.mailService.sendEmail({
      to: [
        {
          name: `${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName}`,
          address: leaveRequest.employee.email,
        },
      ],
      subject: `Leave Request ${leaveRequest.status}`,
      html: `<h1>Leave Request ${leaveRequest.status}</h1> <br/> From : ${leaveRequest.fromDate} <br/> To : ${leaveRequest.toDate} <br/> Reason : ${leaveRequest.reason} <br/> Sugested Coworker : ${leaveRequest.SuggestedCoworker.firstName} ${leaveRequest.SuggestedCoworker.lastName}`,
    });

    return response;
  }

  async sendMailToSuggestedCoworker(leaveRequest: LeaveRequest) {
    const response = await this.mailService.sendEmail({
      to: [
        {
          name: `${leaveRequest.SuggestedCoworker.firstName} ${leaveRequest.SuggestedCoworker.lastName}`,
          address: leaveRequest.SuggestedCoworker.email,
        },
      ],
      subject: `Assigned To Leave Request`,
      html: `<h1>Assigned Leave Request By ${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName} </h1><br/>Status : ${leaveRequest.status} <br/> From : ${leaveRequest.fromDate} <br/> To : ${leaveRequest.toDate} <br/> Reason : ${leaveRequest.reason} <br/> Sugested Coworker : ${leaveRequest.SuggestedCoworker.firstName} ${leaveRequest.SuggestedCoworker.lastName}`,
    });

    return response;
  }
}
