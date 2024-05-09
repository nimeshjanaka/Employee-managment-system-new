import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { User } from './entity/user.entity';
import { HttpResponseService } from 'src/common/http-response.service';

@Controller('user')
@UseGuards(AuthGuard(), RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly httpResponseService: HttpResponseService,
  ) {}

  @Roles('Admin')
  @Post('/create')
  async createUser(
    @Res() response,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<User> {
    try {
      const result = await this.userService.createUser(createAdminDto);
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

  @Post('/create/admin')
  async createAdmin(
    @Res() response,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<User> {
    try {
      const result = await this.userService.createAdmin(createAdminDto);
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
  // @Roles('Admin')
  async findAll(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<User[]> {
    try {
      const result = await this.userService.findAll({
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
  async findOne(@Res() response, @Param('id') id: string): Promise<User> {
    try {
      const result = await this.userService.findOne(+id);
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

  @Get('/by-email/:email')
  async getUserByEmail(
    @Res() response,
    @Param('email') email: string,
  ): Promise<User> {
    try {
      const result = await this.userService.getUserByEmail(email);
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
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const result = await this.userService.update(+id, updateUserDto);
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
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
