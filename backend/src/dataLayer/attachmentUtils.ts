import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Types } from 'aws-sdk/clients/s3';


const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class StorageLogic {
    constructor(
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET) {
    }

    async generateUploadUrl(todoId: string): Promise<string> {
        console.log("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });
        console.log(url);

        return url as string;
    }
}