import { JwtGuard } from './../auth/dto/guard';
import { Controller, Get, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  @Get('me')
  getMyInfo(@GetUser() user: User) {
    return user;
  }
}
