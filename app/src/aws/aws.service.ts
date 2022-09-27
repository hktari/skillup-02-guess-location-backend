import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service'
import { PassThrough } from 'node:stream';
import { ConfigService } from '@nestjs/config';
// Load the SDK for JavaScript
const AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({ region: 'eu-central-1' });


interface ImageHeader {
    extension: string,
    encoding: string,
}


@Injectable()
export class AwsService {
    constructor(private logger: LoggingService, private configService: ConfigService) {

    }

    // header: data:image/jpeg;base64,...
    extractHeader(imageBase64: string): ImageHeader {
        try {

            const imageHeader = imageBase64.substring(0, 22)
            const imageEncoding = imageHeader.split(';')[1]
            const imageExt = imageHeader.split(';')[0].split(':')[1].split('/')[1]
            return {
                extension: imageExt,
                encoding: imageEncoding
            }
        } catch (error) {
            this.logger.error('failed to extract image header: ' + imageBase64.substring(0, 22))
            throw error
        }
    }

    uploadImage(objectId: string, imageBase64: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const logger = this.logger

            // Create S3 service object
            var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
            var uploadParams = { Bucket: this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME'), Key: `${objectId}.jpeg`, Body: null! };

            logger.debug('received imageBase64', 'AwsService')
            const metadata = this.extractHeader(imageBase64)

            const buffer = Buffer.from(imageBase64, "base64");

            var base64Stream = new PassThrough();
            base64Stream.write(buffer, "base64")
            base64Stream.end();

            uploadParams.Body = base64Stream;

            logger.debug('uploading image...', 'AwsService')
            // call S3 to retrieve upload file to specified bucket
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    logger.error(err, 'AwsService');
                    reject(err)
                } if (data) {
                    logger.debug("Upload Success: " + data.Location, 'AwsService');
                    resolve(data.Location)
                }
            });
        })

    }
}
