import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, Request, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return `this deletes the location: ${id}`
  }


}
