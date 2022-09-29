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
        const [items, totalItems] = await this.guessLocationRepository.findAndCount({
            where: { user: { id: userId } },
            relations: { user: true, location: true }
        })
        return {
            startIdx,
            pageSize,
            totalItems,
            items
        }
    }

    async getByLocation(locationId: string, startIdx: number = 0, pageSize: number = undefined): Promise<PaginatedCollection<GuessLocationEntity>> {
        const [items, totalItems] = await this.guessLocationRepository.findAndCount({
            where: { location: { id: locationId } },
            relations: { user: true, location: true },
            skip: startIdx,
            take: pageSize
        })
        return {
            startIdx,
            pageSize,
            totalItems,
            items
        }
    }


}
