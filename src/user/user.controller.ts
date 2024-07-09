import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { EmailService } from '../email/email.service';
import { ChangeEmailDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private emailService: EmailService,
  ) {}

  @Patch('email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateDataAndSendEmail(
    @Req() req: Request,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    const code = await this.userService.generateCode(
      req.user.id,
      changeEmailDto,
    );
    const emailDto = {
      code,
      email: changeEmailDto.email,
    };
    await this.emailService.sendCode(req.user.id, emailDto);
  }
}
