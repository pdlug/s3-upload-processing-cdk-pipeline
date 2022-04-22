#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { S3UploadProcessingPipelineStack } from '../src/stacks/s3-upload-processing-pipeline/s3-upload-processing-pipeline-stack'

const app = new cdk.App()
new S3UploadProcessingPipelineStack(app, 'S3UploadProcessingPipelineStack', {
  env: { account: '322269463104', region: 'us-east-1' },
  repository: 'pdlug/s3-upload-processing-cdk-pipeline',
  githubConnectionArn:
    'arn:aws:codestar-connections:us-east-1:322269463104:connection/741ef80a-4c7a-4de9-8397-8360e8b3a4ca',
})
app.synth()
