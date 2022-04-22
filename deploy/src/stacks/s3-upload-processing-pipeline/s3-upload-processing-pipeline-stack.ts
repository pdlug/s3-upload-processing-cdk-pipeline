import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'
import { aws_codebuild as codebuild } from 'aws-cdk-lib'

import { S3UploadProcessingAppStage } from './s3-upload-processing-app-stage'

type S3UploadProcessingPipelineStackProps = cdk.StackProps & {
  repository: string
  branch?: string
  githubConnectionArn: string
}

export class S3UploadProcessingPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: S3UploadProcessingPipelineStackProps) {
    super(scope, id, props)

    const { githubConnectionArn, repository, branch = 'main' } = props

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'S3UploadProcessingPipelineStack',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(repository, branch, {
          triggerOnPush: true,
          connectionArn: githubConnectionArn,
        }),
        commands: ['pnpm install', 'cd deploy', 'pnpm run build', 'npx cdk synth'],
      }),
      synthCodeBuildDefaults: {
        buildEnvironment: {
          buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_2_0,
        },
      },
    })

    pipeline.addStage(
      new S3UploadProcessingAppStage(this, 'prod', {
        env: { account: '322269463104', region: 'us-east-1' },
      }),
    )
  }
}
