import { Html, Head, Main, NextScript } from 'next/document';

function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Flate for å saksbehandle tiltakspenger"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
