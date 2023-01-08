import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
