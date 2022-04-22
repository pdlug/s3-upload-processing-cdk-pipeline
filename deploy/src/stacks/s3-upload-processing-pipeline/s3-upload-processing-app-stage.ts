import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { S3UploadProcessingStack } from '../s3-upload-processing-stack/s3-upload-processing-stack'

export class S3UploadProcessingAppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new S3UploadProcessingStack(this, 'S3UploadProcessingStack')
  }
}
