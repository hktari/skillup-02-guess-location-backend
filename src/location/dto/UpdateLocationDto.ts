import CreateLocationDto from "./CreateLocationDto";
import { PartialType } from '@nestjs/mapped-types'

export class UpdateLocationDto extends PartialType(CreateLocationDto) {

}