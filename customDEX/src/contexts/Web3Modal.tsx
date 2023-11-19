import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

const base = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org/',
  rpcUrl: 'https://1rpc.io/base'
}
const metadata = {
  name: 'BridgeWallet Exchange',
  description: 'Small exchange for BridgeWallet',
  url: 'http://localhost:3000/',
  icons: ['https://avatars.mywebsite.com/']
}
createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [base],
  projectId: process.env.NEXT_PUBLIC_WEB3MODAL_ID || '',
})

interface Web3ModalProviderProps {
	  children: React.ReactNode;
}
export const Web3ModalProvider: React.FC<Web3ModalProviderProps> = ({ children }) => {
	return children;
}
