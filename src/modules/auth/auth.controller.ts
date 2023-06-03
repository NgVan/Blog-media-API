import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SUCCESS } from 'src/utils/constant';
import { SignInDto } from './dtos/request/signin.dto';
import { SignUpDto } from './dtos/request/signup.dto';

@ApiTags('Auths')
@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post('login')
  signIn(@Body() payload: SignInDto) {
    return this.authService.signIn(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SignUp' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post('signup')
  signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }
}
