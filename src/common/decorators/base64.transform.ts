import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class Base64ToByteTransform implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata) {
        
    }

}