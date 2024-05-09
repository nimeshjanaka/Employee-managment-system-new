import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CannotDetermineEntityError, DataSource, Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { JwtPayload } from './jwt-payload.interface';
import { AuthForgotPasswordDto } from './dto/forgot-password.dto';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPassword } from './entity/forgot-password.entity';
import { PasswordResetDto } from './dto/password-reset.dto';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/role/entity/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; email: string; role: string }> {
    const { email, password } = authCredentialDto;
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: { role: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken, email: user.email, role: user.role.role };
    } else {
      throw new UnauthorizedException(
        'Please check the your login credentials',
      );
    }
  }
}
