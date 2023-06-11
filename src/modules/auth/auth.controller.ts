import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SUCCESS } from 'src/utils/constant';
import { SignInDto } from './dtos/request/signin.dto';
import { SignUpDto } from './dtos/request/signup.dto';
import { ForgotPasswordDto } from './dtos/request/forgotPassword.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AppRequest } from 'src/utils/app-request';
import { AccessTokenGuard } from './guards/auth.guard';

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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() request: AppRequest) {
    return this.authService.refreshTokens(request);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS,
  })
  @Post('forgot-password')
  forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out' })
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() request: AppRequest) {
    return this.authService.logout(request);
  }
}
