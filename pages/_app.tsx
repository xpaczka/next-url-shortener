import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin-ext'], weight: ['400', '700'] });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <main className={poppins.className}>
      <Component {...pageProps} />
    </main>
  );
};

export default App;
