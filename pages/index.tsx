import classes from '../styles/Homepage.module.css';
import { FormEvent, useRef, useState } from 'react';
import { LinkObject } from '@/utils/db-util';
import Image from 'next/image';

interface Data {
  message: string;
  linkObject: LinkObject;
}

const Homepage = () => {
  const [generatedUrl, setGeneratedUrl] = useState<LinkObject | null>(null);
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
    setGeneratedUrl(data.linkObject);
  };

  const copyToClipboardHandler = async () => {
    if (!generatedUrl) return;

    try {
      await navigator.clipboard.writeText(generatedUrl.link);
      console.log('Link copied to clipboard');
    } catch (err: any) {
      console.error(`Failed to copy: ${err}`);
    }
  };

  return (
    <div>
      <h1 className={classes.header}>Next URL Shortener</h1>
      <form onSubmit={formSubmitHandler} className={classes.form}>
        <input className={classes.input} type='text' ref={inputRef} />
        <button className={classes.button} type='submit'>
          Generate
        </button>
      </form>
      <div className={classes['box-link']}>
        <div className={classes['box-link-input']}>{generatedUrl?.link}</div>
        <button className={classes['box-link-button']} onClick={copyToClipboardHandler}>
          <Image src='link.svg' alt='Link' width={18} height={18} />
          <p>Copy</p>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
