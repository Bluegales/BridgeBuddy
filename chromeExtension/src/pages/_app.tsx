import {NextUIProvider} from '@nextui-org/react';
import type { AppProps } from 'next/app';
import {useRouter} from 'next/router';

import styles from '../styles/Pages.module.css';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (<>
    <NextUIProvider navigate={router.push}>
      {/* <Header/> */}
      <div className={styles.container}>
        <Component {...pageProps} />
      </div>
      {/* <Footer /> */}
    </NextUIProvider>
  </>);
}
