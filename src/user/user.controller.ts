import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  update(@Req() req: Request, @Body() updateDto: UpdateDto): Promise<void> {
    return this.userService.update(req.user.id, updateDto);
  }

  @Post('email/code/resend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async resendCode(@Req() req: Request) {
    const userId = req.user.id;
    const { email } = await this.userService.getUserData(userId);
    return this.userService.update(userId, { email });
  }

  @Post('email/code/:codeEmail')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  verifyCode(@Req() req: Request, @Param('codeEmail') codeEmail: string) {
    return this.userService.verifyCode(req.user.id, codeEmail);
  }
}
