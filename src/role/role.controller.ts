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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from './entity/role.entity';
import { HttpResponseService } from 'src/common/http-response.service';

@Controller('role')
@UseGuards(AuthGuard(), RoleGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly httpResponseService: HttpResponseService,
  ) {}

  @Roles('Admin')
  @Post()
  async create(
    @Res() response,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    try {
      const result = await this.roleService.create(createRoleDto);
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

  @Roles('Admin')
  @Get()
  async findAll(
    @Res() response,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Role[]> {
    try {
      const result = await this.roleService.findAll({
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

  @Get('/without-pagination')
  async findAllWithoutPagination(
    @Res() response,
  ): Promise<Role[]> {
    try {
      const result = await this.roleService.findAllWithoutPagination();
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

  @Roles('Admin')
  @Get(':id')
  async findOne(@Res() response, @Param('id') id: string): Promise<Role> {
    try {
      const result = await this.roleService.findOne(+id);
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

  @Roles('Admin')
  @Patch(':id')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    try {
      const result = await this.roleService.update(+id, updateRoleDto);
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

  @Roles('Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
