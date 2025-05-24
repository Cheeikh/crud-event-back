import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayload } from './jwt.strategy';
// import { User as PrismaUser } from '@prisma/client'; // Temporairement commenté

export interface LoginResponse {
  accessToken: string;
  user: Omit<any, 'password'>; // TODO: Remplacer 'any' par un type User précis (ex: PrismaUser)
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<any, 'password'> | null> { // TODO: Remplacer 'any'
    const user = await this.usersService.findByEmail(email);
    // @ts-ignore // findByEmail peut retourner null, et user.password pourrait ne pas exister
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<any, 'password'>): Promise<LoginResponse> { // TODO: Remplacer 'any'
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async registerAndLogin(createUserDto: CreateUserDto): Promise<LoginResponse> {
    const newUser = await this.usersService.create(createUserDto);
    return this.login(newUser);
  }
}
