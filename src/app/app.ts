// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
import * as log from 'lambda-log';
import { UserService } from './service';
import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-northeast-1',
  // endpoint: 'http://dynamodb:8000'
});

const makeClient = () => {
  // const dynamoDbClient = new AWS.DynamoDB({
  //   endpoint: 'http://localhost:8000',
  //   // accessKeyId: awsAccessKeyId,
  //   // secretAccessKey: awsAccessKey,
  //   region: 'ap-northeast-1'
  // })
  const dynamoDB = new AWS.DynamoDB({
    endpoint: 'http://docker.for.mac.localhost:8000',
    maxRetries: 10
  });
  return dynamoDB
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.APIGatewayEventRequestContext) => {
  log.options.meta = {
    // event,
    // context,
    stage: process.env.NODE_ENV,
  }

  try {
    const dbClient = makeClient();

    log.info('debug1111');
    log.info(await dbClient.listTables({}).promise());

    const userService = new UserService();

    // const ret = await axios(url);
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: `hello world service ${userService.test}`,
        // location: ret.data.trim()
      }),
    };
  } catch (err) {
    log.error(err);
    return {
      'statusCode': 500,
      'body': JSON.stringify({
        message: `${err.message}`
      }),
    };
  }

  return response;
};
