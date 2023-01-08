import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (user) {
      return {
        access_token: await this.getJwt(user),
      };
    }
    return null;
  }

  async signUp(email: string, password: string) {
    const newUser = await this.userService.create({ email, password });
    if (newUser instanceof User) {
      return {
        access_token: await this.getJwt(newUser),
      };
    }
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user?.password && (await bcrypt.compare(password, user?.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async getJwt(user: User): Promise<string> {
    return await this.jwtService.sign({ email: user.email, sub: user.id });
  }
}
