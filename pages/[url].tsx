import { GetServerSideProps } from 'next';
import { getShortenedUrlData, LinkObject } from '@/utils/db-util';

const LinkPage = () => {
  return <div>LinkPage</div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const url = context.params?.url as string;
  const data: LinkObject = await getShortenedUrlData(url);
  const { originalUrl } = data;

  return {
    redirect: {
      destination: originalUrl,
      permanent: false,
    },
    props: {},
  };
};

export default LinkPage;
