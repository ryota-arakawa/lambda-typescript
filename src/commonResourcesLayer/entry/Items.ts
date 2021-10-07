import { hashKey, table, attribute } from '@aws/dynamodb-data-mapper-annotations';
import { DataMapper, DynamoDbTable, ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import { DynamoDBConnection } from '../connections';
import * as log from 'lambda-log';
import { v4 as uuidv4 } from 'uuid';

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

  @attribute()
  body: string;
}

export class Items extends DynamoDBConnection {
  private mapper: DataMapper;

  constructor() {
    super();
    this.mapper = new DataMapper({ client: this.client });
  }

  async scanItems() {
    const paginator = this.mapper.scan(ItemsEntry);

    const items: ItemsEntry[] = [];
    for await (const page of paginator) {
      items.push(page);
    }

    return items;
  }

  async addItem() {
    const toSave = Object.assign(new ItemsEntry(), { id: uuidv4() });

    log.info({ toSave }, 'Adding Items');

    const result = await this.mapper.put(toSave);

    log.info(`result is ${JSON.stringify(result)}`);
  }
}
