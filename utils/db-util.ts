import { MongoClient } from 'mongodb';
import { customAlphabet, nanoid } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';

export interface LinkObject {
  id: string;
  originalUrl: string;
  url: string;
  link: string;
}

const createHash = (): string => {
  const hashGenerator = customAlphabet(alphabet, 7);
  const hash = hashGenerator();

  return hash as string;
};

export const connectToDatabase = () => {
  const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9r76zdx.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(MONGO_URI);

  return client;
};

export const createLinkObject = (originalUrl: string): LinkObject => {
  const hash = createHash();
  const linkObject = {
    id: nanoid(),
    originalUrl,
    url: hash,
    link: `${process.env.HOST}${hash}`,
  };

  return linkObject as LinkObject;
};
