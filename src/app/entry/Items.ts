import { hashKey, table, attribute } from '@aws/dynamodb-data-mapper-annotations';
import { DataMapper, DynamoDbTable, ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import { DynamoDBConnection } from '../connections';
import * as log from 'lambda-log';

@table('Items')
export class ItemsEntry {
  // @hashKey({
  //   // <-- this is your normal hash key (shared by table and of LSI)
  //   indexKeyConfigurations: {
  //     ItemIdIndex: 'HASH', // The key (ItemIdIndex) is the name of the index; the value is the key type ('HASH' or 'RANGE')
  //   },
  // })
  @hashKey({})
  id!: string;

  // @attribute()
  // body: string;
}

export class Items extends DynamoDBConnection {
  private mapper: DataMapper;

  constructor() {
    super();
    this.mapper = new DataMapper({ client: this.client });
  }

  async getEntries(clientId?: string, limit?: number, scanForward?: boolean): Promise<any> {
    const paginator = this.mapper.query(ItemsEntry, { partitionKey: 'id' }).pages();

    const items: ItemsEntry[] = [];
    for await (const page of paginator) {
      items.push(...page);
    }

    return {
      items,
    };
  }

  async scanEntries() {
    const paginator = this.mapper.scan(ItemsEntry);

    const items: ItemsEntry[] = [];
    for await (const page of paginator) {
      items.push(page);
    }

    return items;
  }
}
