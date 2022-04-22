import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs'
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources'

type UploadProcessorProps = {
  bucket: s3.Bucket
}

export class UploadProcessor extends Construct {
  public readonly lambda: lambdaNodeJS.NodejsFunction

  constructor(scope: Construct, id: string, { bucket }: UploadProcessorProps) {
    super(scope, id)

    const uploadProcessorLambda = new lambdaNodeJS.NodejsFunction(this, 'UploadProcessor', {
      entry: '../lambda-fns/src/UploadProcessor.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 512,
      environment: {
        BUCKET: bucket.bucketName,
      },
      timeout: cdk.Duration.minutes(5),
      bundling: {
        nodeModules: ['sharp'],
        // forceDockerBundling: true,
        commandHooks: {
          beforeBundling() {
            return ['npm rebuild --arch=arm64 --platform=linux sharp']
          },
          afterBundling() {
            return []
          },
          beforeInstall() {
            return []
          },
        },
      },
    })
    bucket.grantReadWrite(uploadProcessorLambda)

    uploadProcessorLambda.addEventSource(
      new S3EventSource(bucket, {
        events: [s3.EventType.OBJECT_CREATED_COMPLETE_MULTIPART_UPLOAD, s3.EventType.OBJECT_CREATED_PUT],
        filters: [{ prefix: 'uploads/' }],
      }),
    )

    this.lambda = uploadProcessorLambda
  }
}
