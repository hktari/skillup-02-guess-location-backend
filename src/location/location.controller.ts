import { Response, Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor, UnauthorizedException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserEntity } from '../user/entities/user.entity';
import CreateLocationDto from './dto/CreateLocationDto';
import { UpdateLocationDto } from './dto/UpdateLocationDto';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/PaginationDto';

@Roles('user')
@Controller('location')
@UseInterceptors(ClassSerializerInterceptor)
export class LocationController {
  constructor(private readonly locationService: LocationService) { }


  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(req.user,
      {
        address: createLocationDto.address,
        lat: createLocationDto.lat,
        lng: createLocationDto.lng,
        imageUrl: 'TODO'
      })
  }

  @Get()
  findAll(
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe()) startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe()) pageSize: number
  ) {
    return this.locationService.findAll(startIdx, pageSize)
  }


  @Get('/random')
  async getRandom(){
    return this.locationService.getRandom()    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    const location = await this.locationService.findOne(id)

    if (!location) {
      throw new NotFoundException(id, `Location with id ${id} was not found`)
    }

    if (location.user?.id !== req.user.id) {
      throw new ForbiddenException(`User ${req.user.email} can't update location ${location.id} added by ${location.user?.email}`)
    }

    return this.locationService.update(id, updateLocationDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Response() res, @Request() req, @Param('id') id: string) {
    const location = await this.locationService.findOne(id)
    if (location.user?.id !== req.user.id) {
      throw new ForbiddenException(`User ${req.user.email} can't delete location ${location.id} added by ${location.user?.email}`)
    }

    await this.locationService.delete(id)

    return res.sendStatus(200)
  }
}
