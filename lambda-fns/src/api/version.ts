import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda'

import { jsonResponse } from './util'

type VersionResponse = {
  version: string
}

type Response = APIGatewayProxyResultV2<{ error: string } | VersionResponse>

export const handler: APIGatewayProxyHandlerV2<Response> = async (event): Promise<Response> => {
  return jsonResponse({ version: '1.0' })
}
