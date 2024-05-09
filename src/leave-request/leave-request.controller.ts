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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entity/user.entity';
import { HttpResponseService } from 'src/common/http-response.service';
import { LeaveRequest } from './entity/leave-request.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('leave-request')
@UseGuards(AuthGuard(), RoleGuard)
export class LeaveRequestController {
  constructor(
    private readonly leaveRequestService: LeaveRequestService,
    private readonly httpResponseService: HttpResponseService,
  ) {}

  @Post()
  async create(
    @Res() response,
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
    @GetUser() user: User,
  ) {
    try {
      const result = await this.leaveRequestService.create(
        user,
        createLeaveRequestDto,
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
  @Roles('Admin')
  async findAll(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status', new DefaultValuePipe('PENDING')) status = 'PENDING',
  ): Promise<LeaveRequest[]> {
    try {
      const result = await this.leaveRequestService.findAll(status, {
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

  @Get('/user/all')
  async findAllForUser(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status', new DefaultValuePipe('PENDING')) status = 'PENDING',
    @GetUser() user: User,
  ): Promise<LeaveRequest[]> {
    try {
      const result = await this.leaveRequestService.findAllForUser(
        status,
        user,
        {
          page,
          limit,
          route: '/',
        },
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

  @Get('/coworker/all')
  async findAllForCoworker(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status', new DefaultValuePipe('PENDING')) status = 'PENDING',
    @GetUser() user: User,
  ): Promise<LeaveRequest[]> {
    try {
      const result = await this.leaveRequestService.findAllForCoworker(
        status,
        user,
        {
          page,
          limit,
          route: '/',
        },
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

  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string) {
    try {
      const result = await this.leaveRequestService.findOne(+id);
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
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
    @GetUser() user: User,
  ) {
    try {
      const result = await this.leaveRequestService.update(
        +id,
        updateLeaveRequestDto,
        user,
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

  @Patch('/admin/:id')
  @Roles('Admin')
  async updateByAdmin(
    @Res() response,
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ) {
    try {
      const result = await this.leaveRequestService.updateByAdmin(
        +id,
        updateLeaveRequestDto,
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveRequestService.remove(+id);
  }
}
