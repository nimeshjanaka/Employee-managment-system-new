import { Module } from '@nestjs/common';
import { HttpResponseService } from './http-response.service';

@Module({
  imports: [],
  controllers: [],
  providers: [HttpResponseService],
  exports: [HttpResponseService],
})
export class CommonModule {}
