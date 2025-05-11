'use strict';

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { TextDecoder } = require('util');

module.exports.handler = async (event) => {
  console.log('EVENT BODY:', event.body);

  try {
    // 1) Parsear petición
    const { documentId, question } = JSON.parse(event.body);
    if (!documentId || !question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing documentId or question' }),
      };
    }

    // 2) Leer contenido extraído de DynamoDB
    const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
    const getParams = {
      TableName: process.env.DDB_TABLE,
      Key: { DocumentId: { S: documentId } },
      ProjectionExpression: 'Content',
    };
    const data = await ddb.send(new GetItemCommand(getParams));
    const content = data.Item?.Content?.S;
    if (!content) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Document not found' }),
      };
    }

    // 3) Construir prompt
    const prompt = `Context:\n${content}\n\nQuestion: ${question}`;

    // 4) Preparar payload para Titan Text Premier
    const payload = {
      inputText: prompt,
      textGenerationConfig: {
        maxTokenCount: 512,
        temperature: 0.7,
        topP: 0.9,
      },
    };

    // 5) Invocar Bedrock InvokeModel
    const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
    const cmd = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });
    const response = await client.send(cmd);

    // 6) Decodificar la respuesta
    let bodyString;
    const raw = response.body;
    if (raw instanceof Uint8Array || Buffer.isBuffer(raw)) {
      bodyString = new TextDecoder().decode(raw);
    } else {
      // iterable stream
      const chunks = [];
      for await (const chunk of raw) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      bodyString = Buffer.concat(chunks).toString('utf-8');
    }

    // 7) Extraer texto generado
    const result = JSON.parse(bodyString);
    const answer = result.results?.[0]?.outputText || bodyString;

    // 8) Devolver respuesta
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };

  } catch (err) {
    console.error('ERROR in qa handler:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        detail: err.message,
      }),
    };
  }
};
