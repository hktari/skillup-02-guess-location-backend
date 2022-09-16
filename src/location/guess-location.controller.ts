import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from '../common/decorators/user.decorator'
import { GuessLocationDto } from './dto/GuessLocationDto';

@Controller('location/guess')
export class GuessLocationController {

    @Post(':id')
    create(@User() user: UserEntity, @Body() guessLocationDto: GuessLocationDto, @Param('id') id: string) {
        return `guess location ${id}: ${typeof guessLocationDto.lat}`
    }
}
