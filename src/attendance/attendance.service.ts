import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from './entity/attenance.entity';
import { CreateAttendanceDto } from './dto/attendance.dto';
import { format, startOfDay, endOfDay } from 'date-fns';
import { User } from 'src/user/entity/user.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async createAttendance(user: User, createAttendanceDto: CreateAttendanceDto) {
    const { inTime, outTime, date, task, description } = createAttendanceDto;
    const attenance = new Attendance();
    attenance.inTime = inTime;
    attenance.outTime = outTime;
    attenance.date = date;
    attenance.user = user;
    attenance.task = task;
    attenance.description = description;

    return await this.attendanceRepository.save(attenance);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Attendance>> {
    return paginate<Attendance>(this.attendanceRepository, options, {
      relations: {
        user: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllByUser(user: User, options: IPaginationOptions) {
    return paginate<Attendance>(this.attendanceRepository, options, {
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<Attendance> {
    const result = await this.attendanceRepository.findOne({
      where: { id: id },
      relations: { user: true },
    });
    if (!result) {
      throw new NotFoundException('Attendance not found');
    }
    return result;
  }

  async findCurrentAttendance(user: User) {
    const result = await this.attendanceRepository.findOne({
      where: {
        outTime: '',
        user: {
          id: user.id,
        },
      },
    });

    return result;
  }

  async updateAttendance(
    id: number,
    user: User,
    updateAttendanceDto: Partial<CreateAttendanceDto>,
  ) {
    const result = await this.attendanceRepository.update(
      {
        id,
        user: {
          id: user.id,
        },
      },
      updateAttendanceDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Attendance Not Found');
    }

    return result;
  }

  async getTodaysAttendanceCount(): Promise<number> {
    const todayStart = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const todayEnd = format(endOfDay(new Date()), 'yyyy-MM-dd');

    return this.attendanceRepository.count({
      where: {
        date: Between(todayStart, todayEnd),
      },
    });
  }

  async getTodaysAttendanceDetails(): Promise<Attendance[]> {
    const todayStart = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const todayEnd = format(endOfDay(new Date()), 'yyyy-MM-dd');

    return this.attendanceRepository.find({
      where: {
        date: Between(todayStart, todayEnd),
      },
      relations: ['user'],
    });
  }
}