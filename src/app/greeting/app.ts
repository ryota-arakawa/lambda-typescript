import * as log from 'lambda-log';
import { UserService } from './service';
import { DynamoDBConnection } from '@/layers/commonResourcesLayer/connections';
import { Items } from '@/layers/commonResourcesLayer/entry';

let response = {};

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
    // const dynamoDBConnection = new DynamoDBConnection({
    //   enableAWSXray: false,
    //   region: 'ap-northeast-1',
    //   endpoint: 'http://docker.for.mac.localhost:8000',
    // });

    // log.info(await dynamoDBConnection.client.listTables({}).promise());
    const dynamoDBConnection = new DynamoDBConnection();
    // log.info(await dynamoDBConnection.client.listTables({}).promise());

    const items = new Items();
    log.info(await items.scanItems());
    // log.info(await items.getEntries('1234'));
    log.info(`log environment is ${JSON.stringify(process.env.DYNAMODB_ENDPOINT)}`);

    await items.addItem();

    response = {
      headers: {
        'Content-Type': 'lication/json'
      },
      statusCode: 200,
      body: JSON.stringify({
        message: `hello world service ${userService.test}`,
      }),
    };
  } catch (err) {
    log.error(err);
    return {
      headers: {
        'Content-Type': 'lication/json'
      },
      statusCode: 500,
      body: JSON.stringify({
        message: `${err.message}`,
      }),
    };
  }

  log.info(`response is ${response}`);

  // response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: `hello world service test`,
  //   }),
  // };

  return response;
};
