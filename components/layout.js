import Head from 'next/head';
// import Image from 'next/image';
// import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Process Manager" />

        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <title>Process Dashboard powered by PM2</title>
      </Head>
      <main>{children}</main>
    </div>
  );
}
