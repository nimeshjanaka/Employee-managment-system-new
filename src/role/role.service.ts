import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  Not,
  Repository,
} from 'typeorm';
import { Role } from './entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async isRoleExist(role: string): Promise<void> {
    const find = await this.roleRepository.findOneBy({
      role: role,
    });

    if (find) {
      throw new ConflictException('role already exist');
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    await this.isRoleExist(createRoleDto.role);

    const find = await this.roleRepository.find({
      where: {
        role: createRoleDto.role,
      },
    });

    if (find.length > 0) {
      throw new ConflictException('Already exists');
    }

    const result = await this.roleRepository.save(createRoleDto);
    return result;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Role>> {
    return paginate<Role>(this.roleRepository, options, {
      order: {
        id: 'DESC',
      },
    });
  }

  async findAllWithoutPagination() {
    return await this.roleRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id: id });
    if (!role) {
      throw new NotFoundException('Role Not Found');
    }
    return role;
  }

  async isRoleExistExcludeRole(role: string, roleId: number): Promise<void> {
    const find = await this.roleRepository.findOneBy({
      role: role,
      id: Not(roleId),
    });

    if (find) {
      throw new ConflictException('role already exist');
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.isRoleExistExcludeRole(updateRoleDto.role, id);

    const role = await this.roleRepository.findOneBy({
      id: id,
    });

    if (!role) {
      throw new NotFoundException('Role Not Found');
    }

    this.roleRepository.merge(role, updateRoleDto);
    const result = await this.roleRepository.save(role);

    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
