import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service'
import { PassThrough } from 'node:stream';
// Load the SDK for JavaScript
const AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({ region: 'eu-central-1' });


@Injectable()
export class AwsService {
    constructor(private logger: LoggingService) {

    }

    baseUrl: string = "https://skillupmentor.s3.eu-central-1.amazonaws.com"
    bucketName = 'skillupmentor'

    uploadImage(objectId: string, imageBase64: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const logger = this.logger

            // Create S3 service object
            var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
            var uploadParams = { Bucket: this.bucketName, Key: '', Body: null! };

            logger.debug('received imageBase64', 'AwsService')

            var stream = new PassThrough();
            stream.write(imageBase64);
            stream.end();

            // Configure the file stream and obtain the upload parameters
            // var fs = require('fs');
            // var fileStream = fs.createReadStream();
            // fileStream.on('error', function (err) {
            //     console.log('File Error', err);
            // });

            uploadParams.Body = stream;
            uploadParams.Key = objectId;

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
