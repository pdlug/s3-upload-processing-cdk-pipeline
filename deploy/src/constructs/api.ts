import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as apigw2 from '@aws-cdk/aws-apigatewayv2-alpha'
import * as apigwIntegrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3'

export type ApiProps = {
  apiName: string
  bucket: s3.Bucket
}

export class Api extends Construct {
  public readonly api: apigw2.HttpApi

  constructor(scope: Construct, id: string, { apiName, bucket }: ApiProps) {
    super(scope, id)

    const httpApi = new apigw2.HttpApi(this, 'API', {
      apiName,
      corsPreflight: {
        allowHeaders: ['Authorization', 'Access-Control-Allow-Origin', 'Content-Type', 'X-Api-Key'],
        allowMethods: [
          apigw2.CorsHttpMethod.OPTIONS,
          apigw2.CorsHttpMethod.HEAD,
          apigw2.CorsHttpMethod.GET,
          apigw2.CorsHttpMethod.POST,
          apigw2.CorsHttpMethod.PUT,
          apigw2.CorsHttpMethod.PATCH,
          apigw2.CorsHttpMethod.DELETE,
        ],
        allowOrigins: ['*'],
        // maxAge: cdk.Duration.days(10),
      },
    })

    type ApiRoute = {
      name: string
      path: string
      methods: apigw2.HttpMethod[]
    }

    const apiRoutes: ApiRoute[] = [
      { name: 'createUpload', path: '/uploads', methods: [apigw2.HttpMethod.POST] },
      { name: 'version', path: '/version', methods: [apigw2.HttpMethod.GET] },
    ]

    apiRoutes.forEach(({ name, path, methods }) => {
      const apiLambda: lambda.Function = new lambdaNodeJS.NodejsFunction(this, `api-${name}`, {
        entry: `../lambda-fns/src/api/${name}.ts`,
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
        environment: {
          BUCKET_NAME: bucket.bucketName,
        },
      })
      bucket.grantReadWrite(apiLambda)

      const routeIntegration = new apigwIntegrations.HttpLambdaIntegration('ApiIntegration', apiLambda)

      httpApi.addRoutes({
        path,
        methods,
        integration: routeIntegration,
      })
    })

    this.api = httpApi
  }
}
