import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'

export class Storage extends Construct {
  public readonly bucket: s3.Bucket

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id)

    const bucket = new s3.Bucket(this, 'Uploads', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.HEAD,
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedHeaders: ['*'],
          allowedOrigins: ['http://localhost', 'http://localhost:3000'],
          exposedHeaders: ['ETag'],
          maxAge: 3000,
        },
      ],
      lifecycleRules: [
        {
          prefix: '/uploads/',
          expiration: cdk.Duration.days(1),
        },
      ],
      transferAcceleration: true,
      websiteIndexDocument: 'index.html',
    })

    this.bucket = bucket
  }
}
