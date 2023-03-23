import { connectToDatabase, getCollection } from '@/utils/db-util';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Only GET Request are accepted' });
    return;
  }

  const { url } = req.body;

  if (!url) {
    res.status(400).json({ message: 'No URL was provided' });
    return;
  }

  const client = connectToDatabase();

  try {
    client.connect();
    const collection = getCollection(client);
    const data: any = await collection.findOne({ url });

    res.status(200).json({ message: 'Link retrieved succesfully', data });
    return data;
  } catch (err: any) {
    res.status(500).json({ message: 'Internal server error' });
    console.error(err);
  } finally {
    client.close();
  }
};

export default handler;
