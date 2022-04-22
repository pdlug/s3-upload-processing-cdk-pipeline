import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuid } from 'uuid'
import { z } from 'zod'

import { jsonResponse } from './util'

const schema = z
  .object({
    contentType: z.string(),
    filename: z.string(),
    size: z.number(),
  })
  .strict()

type CreateUploadInput = z.infer<typeof schema>

type CreateUploadResponse = {
  contentType: string
  id: string
  url: string
}

type Response = APIGatewayProxyResultV2<{ error: string } | CreateUploadResponse>

const bucketName = process.env.BUCKET_NAME!
const s3 = new S3Client({ region: 'us-east-1' })

export const handler: APIGatewayProxyHandlerV2<Response> = async (event): Promise<Response> => {
  if (!event.headers['content-type']?.match(/^application\/json/) || !event.body) {
    return jsonResponse({ error: 'Not JSON' }, 400)
  }
  const payload = JSON.parse(event.body)

  let input: CreateUploadInput
  try {
    input = schema.parse(payload)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return jsonResponse({ error: err.issues.map((i) => `${i.path[0]}: ${i.message}`).join('; ') }, 400)
    } else {
      throw err
    }
  }

  const id = uuid()
  const { contentType } = input

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `uploads/${id}/content`,
    ContentType: contentType,
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 900 })

  return jsonResponse({ id, contentType, url })
}
