'use strict';

const {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} = require('@aws-sdk/client-textract');
const {
  DynamoDBClient,
  PutItemCommand,
} = require('@aws-sdk/client-dynamodb');

module.exports.handler = async (event) => {
  console.log('S3 Event:', JSON.stringify(event));

  // 1) Extrae bucket y key del evento S3
  const record = event.Records && event.Records[0];
  if (!record) {
    console.error('No S3 record found');
    return;
  }
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  // Inicializa clientes AWS
  const textract = new TextractClient({ region: process.env.AWS_REGION });
  const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });

  try {
    // 2) Inicia el trabajo de análisis asíncrono
    const startCmd = new StartDocumentAnalysisCommand({
      DocumentLocation: { S3Object: { Bucket: bucket, Name: key } },
      FeatureTypes: ['TABLES', 'FORMS'],
    });
    const { JobId } = await textract.send(startCmd);
    console.log(`Started Textract job ${JobId} for ${key}`);

    // 3) Polling hasta que Textract termine
    let jobStatus = 'IN_PROGRESS';
    let analysisResult = null;
    while (jobStatus === 'IN_PROGRESS') {
      await new Promise((r) => setTimeout(r, 5000)); // espera 5s

      const getCmd = new GetDocumentAnalysisCommand({ JobId });
      const res = await textract.send(getCmd);
      jobStatus = res.JobStatus;
      analysisResult = res;
      console.log(`Job ${JobId} status: ${jobStatus}`);
    }

    if (jobStatus !== 'SUCCEEDED') {
      throw new Error(`Textract job ${JobId} failed with status ${jobStatus}`);
    }

    // 4) Extrae todas las líneas de texto
    const blocks = analysisResult.Blocks || [];
    const text = blocks
      .filter((b) => b.BlockType === 'LINE' && b.Text)
      .map((b) => b.Text)
      .join('\n');

    // 5) Guarda el resultado en DynamoDB
    const putParams = {
      TableName: process.env.DDB_TABLE,
      Item: {
        DocumentId: { S: key },
        Content:    { S: text },
        Timestamp:  { S: new Date().toISOString() },
      },
    };
    console.log('Putting item into DynamoDB:', putParams);
    await ddb.send(new PutItemCommand(putParams));

    console.log(`Documento ${key} procesado y almacenado en ${process.env.DDB_TABLE}`);
    return;
  } catch (err) {
    console.error('ERROR in textract handler:', err);
    // Re-lanza para que Lambda marque fallo y puedas ver el log
    throw err;
  }
};
