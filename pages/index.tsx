import classes from '../styles/Homepage.module.css';
import { FormEvent, useRef, useState } from 'react';
import { LinkObject } from '@/utils/db-util';

interface Data {
  message: string;
  linkObject: LinkObject;
}

const Homepage = () => {
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const originalUrl = inputRef.current?.value as string;
    if (!originalUrl) return;

    const response = await fetch('/api/create-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originalUrl }),
    });

    const data: Data = await response.json();
    setGeneratedUrl(data.linkObject.link);
  };

  return (
    <div>
      <h1 className={classes.header}>Next URL Shortener</h1>
      <form onSubmit={formSubmitHandler} className={classes.form}>
        <input type='text' ref={inputRef} />
        <button type='submit'>Generate</button>
      </form>
      <p>{generatedUrl}</p>
    </div>
  );
};

export default Homepage;
