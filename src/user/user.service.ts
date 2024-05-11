import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Not, Repository } from 'typeorm';
import { Role } from 'src/role/entity/role.entity';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService implements OnModuleInit {
  logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  onModuleInit() {
    this.createInitialUser();
  }

  // admin user seeder
  async createInitialUser(): Promise<void> {
    let role: Role;
    const findRole = await this.roleRepository.find({
      where: {
        role: 'Admin',
      },
    });

    if (findRole.length == 0) {
      role = new Role();
      role.role = 'Admin';
      await this.roleRepository.save(role);
    }

    const findUser = await this.userRepository.find({
      where: {
        email: 'admin@gmail.com',
      },
    });

    if (findUser.length == 0) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('Admin', salt);
      const user = new User();
      user.firstName = 'Admin';
      user.lastName = 'Admin';
      user.email = 'admin@gmail.com';
      user.telNo = '77123456789';
      user.nic = '971580495v';
      user.password = hashedPassword;
      user.role = findRole[0] ? findRole[0] : role;
      await this.userRepository.save(user);
    }
  }

  // check email already exits while user create
  async isEmailAlreadyExist(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({
      email: email.toLowerCase(),
    });

    if (user) {
      throw new ConflictException('email already exist !');
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    await this.isEmailAlreadyExist(createAdminDto.email);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);
    createAdminDto.password = hashedPassword;

    const role = await this.roleRepository.findOneBy({
      role: 'Admin',
    });
    createAdminDto.role = role;
    createAdminDto.email = createAdminDto.email.toLowerCase();
    createAdminDto.is_permanent = true;
    const result = await this.userRepository.save(createAdminDto);

    return result;
  }

  async createUser(createAdminDto: CreateAdminDto): Promise<User> {
    await this.isEmailAlreadyExist(createAdminDto.email);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAdminDto.password, salt);
    createAdminDto.password = hashedPassword;

    let role = await this.roleRepository.findOneBy({
      id: createAdminDto.role,
    });

    createAdminDto.role = role;
    createAdminDto.email = createAdminDto.email.toLowerCase();
    const result = await this.userRepository.save(createAdminDto);
    return result;
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options, {
      where: {
        role: {
          role: 'employee',
        },
      },
      relations: {
        role: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    delete user.password;
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    delete user.password;
    return user;
  }

  // check email already exits while user update
  async isEmailAlreadyExistExcludeUser(
    email: string,
    userId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({
      email: email.toLowerCase(),
      id: Not(userId),
    });

    if (user) {
      throw new ConflictException('email already exist !');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    delete updateUserDto.password;
    delete updateUserDto.role;
    updateUserDto.email = updateUserDto.email.toLowerCase();

    await this.isEmailAlreadyExistExcludeUser(updateUserDto.email, id);

    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    this.userRepository.merge(user, updateUserDto);
    const result = await this.userRepository.save(user);
    delete result.password;
    return result;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
