import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HttpResponseService } from 'src/common/http-response.service';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entity/attenance.entity';
import { CreateAdminDto } from 'src/user/dto/create-admin.dto';
import { User } from 'src/user/entity/user.entity';
import { CreateAttendanceDto } from './dto/attendance.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('attendance')
@UseGuards(AuthGuard(), RoleGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly httpResponseService: HttpResponseService,
  ) {}

  @Post('')
  async createAttendance(
    @Res() response,
    @Body() createAttendanceDto: CreateAttendanceDto,
    @GetUser() user: User,
  ): Promise<Attendance> {
    try {
      const result = await this.attendanceService.createAttendance(
        user,
        createAttendanceDto,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            error.status || HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @Get()
  async findAll(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Attendance[]> {
    try {
      const result = await this.attendanceService.findAll({
        page,
        limit,
        route: '/',
      });
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            error.status || HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @Get('user')
  async findAllByUser(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @GetUser() user: User,
  ): Promise<Attendance[]> {
    try {
      const result = await this.attendanceService.findAllByUser(user, {
        page,
        limit,
        route: '/',
      });
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            error.status || HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @Get(':id')
  async findById(
    @Res() response,
    @Param('id') id: number,
  ): Promise<Attendance> {
    try {
      const result = await this.attendanceService.findById(id);
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            error.status || HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @Get('current/attendance')
  async findCurrentAttendance(
    @Res() response,
    @GetUser() user: User,
  ): Promise<Attendance> {
    try {
      const result = await this.attendanceService.findCurrentAttendance(user);
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            error.status || HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }




  @Patch(':id')
  async updateAttendance(
    @Res() response,
    @Body() createAttendanceDto: Partial<CreateAttendanceDto>,
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Attendance> {
    try {
      const result = await this.attendanceService.updateAttendance(
        id,
        user,
        createAttendanceDto,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            error.status || HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }
}

