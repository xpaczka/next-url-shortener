import { GetServerSideProps } from 'next';

const LinkPage = () => {
  return <div>LinkPage</div>;
};

export const getServerSideProps: GetServerSideProps = async context => {
  const url = context.params?.url as string;
  const response = await fetch(`${process.env.HOST}/api/retrieve-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();

  if (!data.data) {
    return {
      notFound: true,
    };
  }

  const { originalUrl } = data.data;

  return {
    redirect: {
      destination: originalUrl,
      permanent: false,
    },
    props: {},
  };
};

export default LinkPage;
