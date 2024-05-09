import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpResponseService {
  SUCCESS = 'success';
  ERROR = 'error';
  send(message: string, httpCode: number, payload: any) {
    return { message: message, httpCode: httpCode, payload: payload || null };
  }
}
