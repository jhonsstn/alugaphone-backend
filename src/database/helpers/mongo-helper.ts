import { Collection, MongoClient } from 'mongodb';

const MongoHelper = {
  connection: null as unknown as MongoClient,
  async connect(uri: string): Promise<void> {
    this.connection = await MongoClient.connect(uri);
  },

  async disconnect(): Promise<void> {
    await this.connection.close();
  },
  getCollection(name: string): Collection {
    return this.connection.db().collection(name);
  },

  mapId(collection: any): any {
    const { _id: id, ...collectionWithoutId } = collection;
    return { id: id.toString(), ...collectionWithoutId };
  },
};

export default MongoHelper;
