import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NextUIProvider } from "@nextui-org/react";
import { Web3ModalProvider } from "../contexts/Web3Modal";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Web3ModalProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </Web3ModalProvider>
    </NextUIProvider>
  )
}
