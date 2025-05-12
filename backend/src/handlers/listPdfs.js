'use strict';

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

module.exports.handler = async () => {
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const res = await s3.send(new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME,
  }));

  const pdfs = (res.Contents || []).map((obj) => ({
    id: obj.Key,
    name: obj.Key,
  }));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    },
    body: JSON.stringify({ pdfs }),
  };
};
