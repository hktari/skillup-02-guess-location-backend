import {
  Response,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import CreateLocationDto from './dto/CreateLocationDto';
import { UpdateLocationDto } from './dto/UpdateLocationDto';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { AwsService } from '../aws/aws.service';
import { LoggingService } from '../logging/logging.service';
import { GuessService } from './guess.service';
const { v4: uuidv4 } = require('uuid');

@Roles('user')
@Controller('location')
@UseInterceptors(ClassSerializerInterceptor)
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private guessService: GuessService,
    private awsService: AwsService,
    private logger: LoggingService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createLocationDto: CreateLocationDto) {
    const imageId = uuidv4();
    const imageUrl = await this.awsService.uploadImage(
      imageId,
      createLocationDto.imageBase64,
    );

    return this.locationService.create(req.user, {
      address: createLocationDto.address,
      lat: createLocationDto.lat,
      lng: createLocationDto.lng,
      imageUrl,
    });
  }

  @Get()
  findAll(
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe())
    startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe())
    pageSize: number,
  ) {
    return this.locationService.findAll(startIdx, pageSize);
  }

  @Get('to-guess')
  @UseGuards(AuthGuard('jwt'))
  getLocationsToGuess(
    @Req() req,
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe())
    startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe())
    pageSize: number,
  ) {
    return this.locationService.findLocationsToGuess(
      req.user.id,
      startIdx,
      pageSize,
    );
  }

  @Get('/random')
  async getRandom() {
    return this.locationService.getRandom();
  }

  @Get(':id/leaderboard')
  async getLeaderboards(
    @Param('id') id: string,
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe())
    startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe())
    pageSize: number,
  ) {
    const location = await this.locationService.findOne(id);
    if (!location) {
      throw new NotFoundException(`Location with id ${id} wasn't found`);
    }

    return await this.guessService.getByLocation(id, startIdx, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const location = await this.locationService.findOne(id);

    if (!location) {
      throw new NotFoundException(id, `Location with id ${id} was not found`);
    }

    if (location.user?.id !== req.user.id) {
      throw new ForbiddenException(
        `User ${req.user.email} can't update location ${location.id} added by ${location.user?.email}`,
      );
    }

    const locationUpdate = {
      address: updateLocationDto.address,
      lat: updateLocationDto.lat,
      lng: updateLocationDto.lng,
      imageUrl: location.imageUrl,
    };

    if (updateLocationDto.imageBase64) {
      this.logger.debug('Received imageBase64', 'LocationController');
      const imageId = uuidv4();
      locationUpdate.imageUrl = await this.awsService.uploadImage(
        imageId,
        updateLocationDto.imageBase64,
      );
    }

    return this.locationService.update(id, locationUpdate);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Response() res, @Request() req, @Param('id') id: string) {
    const location = await this.locationService.findOne(id);
    if (location.user?.id !== req.user.id) {
      throw new ForbiddenException(
        `User ${req.user.email} can't delete location ${location.id} added by ${location.user?.email}`,
      );
    }

    await this.locationService.delete(id);

    res.sendStatus(200);
  }
}
