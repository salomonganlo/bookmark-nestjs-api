import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param dto
   * @returns
   */
  async signin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException("User doesn't exist");

    if (!(await argon.verify(user.password, dto.password)))
      throw new ForbiddenException('Incorrect credentials');

    delete user.password;
    return user;
  }

  /**
   *
   * @param dto
   * @returns {User} user
   */
  async signup(dto: AuthDto) {
    const hashPassword = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashPassword,
          firstname: dto.firstname,
          lastname: dto.lastname,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists!');
        }
        throw error;
      }
    }
  }
}
