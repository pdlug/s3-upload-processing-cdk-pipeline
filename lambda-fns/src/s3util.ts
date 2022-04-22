import * as stream from 'stream'

/*
 * Convert any of the stream types that S3 GetObject can return to a Buffer. AWS SDK v3
 * makes it very hard to just get the body contents in a usable form. See the link
 * below for details.
 *
 * @see {@link https://github.com/aws/aws-sdk-js-v3/issues/1877}
 */
export async function streamToBuffer(stream: stream.Readable | Blob | undefined) {
  if (!stream) return
  if (stream instanceof Blob) {
    return Buffer.from(await stream.arrayBuffer())
  }

  const payload = await stream.read()
  return Buffer.from(payload)
}
