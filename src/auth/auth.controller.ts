import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';
import { ThrottleExceptionFilter } from '../filters/ThrottleExceptionFilter';
@Controller('auth')
export class AuthController {
  cookies_options: {} = {
    expires: new Date(new Date().getTime() + 30 * 1000),
    // sameSite: 'strict',
    // httpOnly: true,
    // secure: true,
  };

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  @Post('login')
  @UseFilters(ThrottleExceptionFilter)
  async login(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(user.email, user.password);
    if (result?.access_token) {
      response.cookie('jwt', result?.access_token, this.cookies_options);
      return result;
    } else {
      return new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('signup')
  async signup(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signUp(user.email, user.password);
    if (!(result instanceof HttpException) && result?.access_token) {
      response.cookie('jwt', result?.access_token, this.cookies_options);
    }
    return result;
  }
}
