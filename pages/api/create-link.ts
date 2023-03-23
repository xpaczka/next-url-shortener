import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, createLinkObject, getCollection } from '@/utils/db-util';

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

  const client = connectToDatabase();

  try {
    client.connect();
    const collection = getCollection(client);

    const existingLink = await collection.findOne({ originalUrl });
    let linkObject: any;

    if (!existingLink) {
      linkObject = createLinkObject(originalUrl);
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
