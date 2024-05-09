import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { HttpResponseService } from 'src/common/http-response.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpResponseService: HttpResponseService,
    private authService: AuthService,
  ) {}

  @Post('/signin')
  async signIn(
    @Res() response,
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string; email: string; role: string }> {
    try {
      const result = await this.authService.signIn(authCredentialDto);
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
}
