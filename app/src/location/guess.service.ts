import { Inject, Injectable } from '@nestjs/common';
import { GuessLocationEntity } from './entities/guess-location.entity';
import { Repository } from 'typeorm';
import { GuessLocationRepository } from '../common/constants';
import { LoggingService } from '../logging/logging.service';
import { PaginatedCollection } from '../common/interface/PaginatedCollection';

@Injectable()
export class GuessService {
    constructor(@Inject(GuessLocationRepository) private guessLocationRepository: Repository<GuessLocationEntity>, private logger: LoggingService) {

    }

    async getByUser(userId: string, startIdx: number = 0, pageSize: number = -1): Promise<PaginatedCollection<GuessLocationEntity>> {
        const [items, totalItems] = await this.guessLocationRepository.findAndCountBy({ user: { id: userId } })
        return {
            startIdx,
            pageSize,
            totalItems,
            items
        }
    }

    
}
