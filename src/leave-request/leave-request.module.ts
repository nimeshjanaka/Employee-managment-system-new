import { Module } from '@nestjs/common';
import { LeaveRequestService } from './leave-request.service';
import { LeaveRequestController } from './leave-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequest } from './entity/leave-request.entity';
import { User } from 'src/user/entity/user.entity';
import { HttpResponseService } from 'src/common/http-response.service';
import { PassportModule } from '@nestjs/passport';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([LeaveRequest, User]),
  ],
  controllers: [LeaveRequestController],
  providers: [LeaveRequestService, HttpResponseService, MailerService],
})
export class LeaveRequestModule {}
