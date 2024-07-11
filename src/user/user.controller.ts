import {
  Body,
  Controller,
  Get,
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
import { GetUserDataResponse, UpdateResponse } from './types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  getUserData(@Req() req: Request): Promise<GetUserDataResponse> {
    return this.userService.getUserData(req.user.id);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  update(
    @Req() req: Request,
    @Body() updateDto: UpdateDto,
  ): Promise<UpdateResponse> {
    return this.userService.update(req.user.id, updateDto);
  }

  @Post('email/code/resend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async resendCode(@Req() req: Request): Promise<UpdateResponse> {
    const userId = req.user.id;
    const { email } = await this.userService.getUserData(userId);
    return this.userService.update(userId, { email }, true);
  }

  @Post('email/code/:codeEmail')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  verifyCode(
    @Req() req: Request,
    @Param('codeEmail') codeEmail: string,
  ): Promise<void> {
    return this.userService.verifyCode(req.user.id, codeEmail);
  }
}
