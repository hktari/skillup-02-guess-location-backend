import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { identity } from 'rxjs';
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
  findAll(
    @Query('startIdx', new DefaultValuePipe(0), new ParseIntPipe()) startIdx: number,
    @Query('pageSize', new DefaultValuePipe(10), new ParseIntPipe()) pageSize: number
  ) {
    return `this retrieves all locations from: ${startIdx} to ${startIdx + pageSize}`
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
