import {NextUIProvider} from '@nextui-org/react';
import type { AppProps } from 'next/app';
import {useRouter} from 'next/router';

import styles from '../styles/Pages.module.css';
import '../styles/globals.css';
import UserProvider from '../contexts/user';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (<>
    <NextUIProvider navigate={router.push}>
      <div className={styles.container}>
        <UserProvider>
          {/* <Header/> */}
          <Component {...pageProps} />
          {/* <Footer /> */}
        </UserProvider>
      </div>
    </NextUIProvider>
  </>);
}
