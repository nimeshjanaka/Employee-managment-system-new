import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Role } from 'src/role/entity/role.entity';
import { HttpResponseService } from 'src/common/http-response.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Role, User]),
  ],
  controllers: [UserController],
  providers: [HttpResponseService, UserService],
})
export class UserModule {}
