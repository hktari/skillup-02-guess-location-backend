import { Injectable } from '@nestjs/common';
import { Location } from './interfaces/Location.interface'

@Injectable()
export class LocationService {
    private locations: Location[] = []

    create(location: Location) {
        this.locations.push(location)
    }
}
