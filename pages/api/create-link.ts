import { NextApiRequest, NextApiResponse } from 'next';
import { customAlphabet, nanoid } from 'nanoid';
import { MongoClient, WithId } from 'mongodb';

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9r76zdx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(MONGO_URI);
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';

const createHash = (): string => {
  const hashGenerator = customAlphabet(alphabet, 10);
  const hash = hashGenerator();

  return hash as string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only POST requests are accepted' });
    return;
  }

  const { originalUrl } = req.body;
  if (!originalUrl) {
    res.status(400).json({ message: 'No { originalUrl: string } was provided' });
    return;
  }

  try {
    client.connect();
    const db = client.db('url-shortener');
    const collection = db.collection('links');

    const existingLink = await collection.findOne({ originalUrl });
    let linkObject: any;

    if (!existingLink) {
      const hash = createHash();

      linkObject = {
        id: nanoid(),
        originalUrl,
        url: hash,
        link: `${process.env.HOST}${hash}`,
      };

      await collection.insertOne(linkObject);
      res.status(200).json({ message: 'URL created succesfully', linkObject });
    } else {
      linkObject = existingLink;
      res.status(200).json({ message: 'URL already exists', linkObject });
    }

    return linkObject;
  } catch (err: any) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  } finally {
    client.close();
  }
};

export default handler;
