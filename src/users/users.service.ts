import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    try {
      const newUser = this.usersRepository.create({
        password: await bcrypt.hash(user.password, +process.env.hash_random),
        email: user.email,
        role: 'User',
        isActive: false,
      });

      const response = await this.usersRepository.save(newUser);
      return response;
    } catch (error) {
      return new HttpException('Email Is Used Before', HttpStatus.FOUND);
    }
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(userId: number) {
    return await this.usersRepository.findOneBy({ id: userId });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, {
      ...updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  excludePassword(users: User[]): User[] {
    return users.map((user) => ({
      password: undefined,
      ...user,
    }));
  }
}
