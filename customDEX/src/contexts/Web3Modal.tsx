import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

const basegoerli = {
  chainId: 84531,
  name: 'Base GOERLI',
  currency: 'ETH',
  explorerUrl: 'https://goerli.basescan.org/',
  rpcUrl: 'https://base-goerli.publicnode.com/'
}
const metadata = {
  name: 'BridgeWallet Exchange',
  description: 'Small exchange for BridgeWallet',
  url: 'http://http://localhost:3000/',
  icons: ['https://avatars.mywebsite.com/']
}
createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [basegoerli],
  projectId: process.env.NEXT_PUBLIC_WEB3MODAL_ID || '',
})

interface Web3ModalProviderProps {
	  children: React.ReactNode;
}
export const Web3ModalProvider: React.FC<Web3ModalProviderProps> = ({ children }) => {
	return children;
}
