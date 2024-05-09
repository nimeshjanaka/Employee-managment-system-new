import { HttpResponseService } from 'src/common/http-response.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ForgotPassword } from './entity/forgot-password.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600 * 24,
      },
    }),
    TypeOrmModule.forFeature([ForgotPassword, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, HttpResponseService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
