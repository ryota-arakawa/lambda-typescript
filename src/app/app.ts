// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
import * as log from 'lambda-log';
import { UserService } from './service';

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
  log.info('Start process');
  log.info('Start process');

  try {
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
    console.log(err);
    return err;
  }

  return response;
};
