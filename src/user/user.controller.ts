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
import { EmailService } from '../email/email.service';
import { ChangeEmailDto, UpdateDto } from './dto';
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

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async update(@Req() req: Request, @Body() updateDto: UpdateDto) {
    return await this.userService.update(req.user.id, updateDto);
  }

  @Post('email/code/resend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async resendCode(@Req() req: Request) {
    const emailDto = await this.userService.getEmailCode(req.user.id);
    await this.emailService.sendCode(req.user.id, emailDto);
  }

  @Post('email/code/:codeEmail')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  verifyCode(@Req() req: Request, @Param('codeEmail') codeEmail: string) {
    return this.userService.verifyCode(req.user.id, codeEmail);
  }
}
