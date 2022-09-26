import { Body, ClassSerializerInterceptor, Controller, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { User } from '../common/decorators/user.decorator'
import { GuessLocationDto } from './dto/GuessLocationDto';
import { AuthGuard } from '@nestjs/passport';
import { LocationService } from './location.service';
import { create } from 'domain';

@Controller('location/guess')
@UseInterceptors(ClassSerializerInterceptor)
export class GuessLocationController {
    constructor(private locationService: LocationService) { }

    @Post(':id')
    @UseGuards(AuthGuard('jwt'))
    create(@User() user: UserEntity, @Body() guessLocationDto: GuessLocationDto, @Param('id') id: string) {
        return this.locationService.guessLocation(id, user.id, guessLocationDto)
    }
}
