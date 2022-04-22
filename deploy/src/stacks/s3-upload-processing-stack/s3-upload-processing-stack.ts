import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'

import { Api } from '../../constructs/api'
import { Storage } from '../../constructs/storage'
import { UploadProcessor } from '../../constructs/upload-processor'

export class S3UploadProcessingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const storage = new Storage(this, 'Storage')
    new UploadProcessor(this, 'UploadProcessor', { bucket: storage.bucket })
    const api = new Api(this, 'Api', { apiName: 'upload-example-api', bucket: storage.bucket })

    new cdk.CfnOutput(this, 'API_URL', {
      value: api.api.url || '',
    })
  }
}
