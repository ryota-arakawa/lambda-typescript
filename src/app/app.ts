import * as log from 'lambda-log';
import { UserService } from './service';
import { DynamoDBConnection } from './connections';

let response;

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
exports.lambdaHandler = async (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.APIGatewayEventRequestContext
) => {
  log.options.meta = {
    // event,
    // context,
    stage: process.env.NODE_ENV,
  };

  try {
    const userService = new UserService();
    const dynamoDBConnection = new DynamoDBConnection({
      enableAWSXray: false,
      region: 'ap-northeast-1',
      endpoint: 'http://docker.for.mac.localhost:8000',
    });

    log.info(await dynamoDBConnection.client.listTables({}).promise());

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `hello world service ${userService.test}`,
      }),
    };
  } catch (err) {
    log.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `${err.message}`,
      }),
    };
  }

  return response;
};
