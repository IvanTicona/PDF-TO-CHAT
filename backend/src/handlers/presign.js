'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

module.exports.handler = async (event) => {
  console.log('EVENT BODY:', event.body);
  console.log('BUCKET_NAME:', process.env.BUCKET_NAME);

  try {
    const { filename, contentType } = JSON.parse(event.body);

    const s3 = new S3Client({ region: process.env.AWS_REGION });
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 900 });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: JSON.stringify({ url }),
    };
  } catch (err) {
    console.error('ERROR in presign:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        detail: err.message,
      }),
    };
  }
};
