import {
  Request,
  Response,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  NotFoundException,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserProfileDto } from './dto/UpdateUserProfileDto';
import { UserService } from './user.service';
import { Response as ExpressResponse } from 'express';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { LoggingService } from '../logging/logging.service';
import { AwsService } from '../aws/aws.service';
import { GuessService } from '../location/guess.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private logger: LoggingService,
    private awsService: AwsService,
    private guessService: GuessService,
  ) {}

  @Get()
  getAll(
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe())
    startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe())
    pageSize: number,
  ) {
    return this.userService.getAll(startIdx, pageSize);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-profile')
  getMyProfile(@Request() req) {
    this.logger.debug(
      'req.user\n' + JSON.stringify(req.user),
      'UserController',
    );
    return this.userService.getOne(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('my-profile')
  updateMyProfile(
    @Request() req,
    @Body() { firstName, lastName }: UpdateUserProfileDto,
  ) {
    return this.userService.update({
      email: req.user.email,
      firstName: firstName ?? req.user.firstName,
      lastName: lastName ?? req.user.lastName,
      imageUrl: req.user.imageUrl,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('my-profile/image')
  async updateProfileImage(
    @Request() req,
    @Body('imageBase64', new ValidationPipe()) imageBase64: string,
  ) {
    let imageUrl;
    if (imageBase64) {
      this.logger.debug('received imageBase64');
      imageUrl = await this.awsService.uploadImage(req.user.id, imageBase64);
    }

    return await this.userService.update({
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      imageUrl: imageUrl,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('my-profile/password')
  async updateMyPassword(
    @Request() req,
    @Response() res: ExpressResponse,
    @Body(new ValidationPipe({ transform: false }))
    { password }: ChangePasswordDto,
  ) {
    await this.userService.setPassword(req.user.email, password);
    res.sendStatus(200);
  }

  @Get(':id/guess')
  async getLocationGuesses(
    @Param('id') id: string,
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe())
    startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe())
    pageSize: number,
  ) {
    const user = await this.userService.getOne(id);

    if (!user) {
      throw new NotFoundException(`Faild to find user with id ${id}`);
    }

    return this.guessService.getByUser(id, startIdx, pageSize);
  }

  @Get(':id')
  async getSingle(@Param('id') id: string) {
    const user = await this.userService.getOne(id);

    if (!user) {
      throw new NotFoundException(`Failed to find user with id ${id}`);
    }

    return user;
  }
}
