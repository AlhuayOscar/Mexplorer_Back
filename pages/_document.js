import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style>{`
          body {
            background-color: rgb(251, 250, 253);
            /* Otros estilos que desees */
          }
        `}</style>
        <title>Administración Mexplorer</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
