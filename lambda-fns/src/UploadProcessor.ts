import * as AWSLambda from 'aws-lambda'
import { S3 } from '@aws-sdk/client-s3'

import { streamToBuffer } from './s3util'

const sharp = require('sharp')

const bucketName = process.env.BUCKET!

const s3 = new S3({ region: 'us-east-1' })

export const handler: AWSLambda.S3Handler = async (event) => {
  await Promise.all(
    event.Records.map(async (record) => {
      const id = record.s3.object.key.split('/')[1]
      const newKey = `files/${id}/content`
      console.log(`Processing upload: ${id}`)

      await s3.copyObject({
        Bucket: bucketName,
        CopySource: `${record.s3.bucket.name}/${record.s3.object.key}`,
        Key: newKey,
      })

      await s3.deleteObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      })

      // Process the contents of the file
      const obj = await s3.getObject({
        Bucket: bucketName,
        Key: newKey,
      })

      if (obj.ContentType?.match(/^image\//)) {
        const original = await streamToBuffer(obj.Body as any)
        const thumbnail = await sharp(original).resize(200).toFormat('png').toBuffer()
        await s3.putObject({
          Bucket: bucketName,
          Key: `files/${id}/thumbnail.png`,
          Body: thumbnail,
        })
      }
    }),
  )
}
