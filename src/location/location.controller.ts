import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { identity } from 'rxjs';
import { ListAllEntities } from 'src/common/dto/ListAllEntities';
import CreateLocationDto from './dto/CreateLocationDto';
import { UpdateLocationDto } from './dto/UpdateLocationDto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }


  @Post()
  create(@Body() createLocationDto: CreateLocationDto) {
    return createLocationDto
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `this retrieves all locations from: ${query.startIdx} to ${query.startIdx + query.pageSize}`
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `this retrieves the location: ${id}`
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return 'this updates the location: ' + id
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return `this deletes the location: ${id}`
  }
}
