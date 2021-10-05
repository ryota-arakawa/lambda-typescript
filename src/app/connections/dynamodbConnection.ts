import { Connection } from './connection';
import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';

export class DynamoDBConnection implements Connection {
  private readonly __documentClient: AWS.DynamoDB.DocumentClient;
  private readonly __client: AWS.DynamoDB;

  constructor(options: { region?: string; endpoint: string | undefined; enableAWSXray: boolean }) {
    const dynamoDBOptions: DynamoDB.ClientConfiguration = {
      region: options.region,
      endpoint: options.endpoint,
    };

    if (options.enableAWSXray) {
      const AWSXRay = require('aws-xray-sdk-core');
      const aws = AWSXRay.captureAWS(AWS);
      this.__client = new aws.DynamoDB(dynamoDBOptions);
      this.__documentClient = new aws.DynamoDB.DocumentClient({
        service: this.__client,
      });
    } else {
      this.__client = new DynamoDB(dynamoDBOptions);
      this.__documentClient = new DynamoDB.DocumentClient({
        service: this.__client,
      });
    }
  }

  public get documentClient() {
    return this.__documentClient;
  }

  public get client() {
    return this.__client;
  }
}
