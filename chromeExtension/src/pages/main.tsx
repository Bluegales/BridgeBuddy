import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import WalletAddress from "../components/WalletAddress";
import { getChainData, getUrl } from "../helper/utils";
import IconButton from "../components/IconButton";
import { ScrollShadow } from "@nextui-org/react";
import CoinItem from "../components/TokenItem";
import SafeApiKit from "@safe-global/api-kit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const MainPage = () => {
	const [balances, setBalances] = useState({} as {[token: string]: number});
	const [loading, setLoading] = useState(true);
	const [chainData, setChainData] = useState({
		rpcs: {},
		accounts: {},
		tokens: {}
	});

	const loadBalances = async () => {
		if (Object.keys(chainData.tokens).length === 0) return;
		console.log('Loading Balanes');
		setLoading(true);
		const erc20Abi = await fetch(getUrl('/erc20abi.json')).then((response) => response.json());
		setBalances(await Object.keys(chainData.tokens).reduce(async (resultPromise, token) => {
		  var result = await resultPromise;
		  result[token] = await Object.keys(chainData.tokens[token]).reduce(async (accumulatedPromise, contractChain) => {
			const accumulated = await accumulatedPromise;
	
			const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, chainData.rpcs[contractChain]);
			const contract = new ethers.Contract(chainData.tokens[token][contractChain]["collateral"], erc20Abi, signer)
	
			return accumulated + parseFloat(ethers.utils.formatUnits(await contract.balanceOf(chainData.accounts[contractChain]), await contract.decimals()));
		  }, Promise.resolve(0));
		  return result;
		}, Promise.resolve({})));
		setLoading(false);
	}

	// Load chainData
	useEffect(() => {
	(async () => {
		setChainData(await getChainData());
		// console.log(await loadData(["privateKey"])["privateKey"]);
	})();
	}, []);

	// Load Balances
	useEffect(() => {
	loadBalances();
	}, [chainData]);

	const buttonFunc = async () => {
		const RPC_URL = 'https://eth-goerli.public.blastapi.io'
		const SAFE_ADDRES = '0xea49182d6557F8BD20Fe8c56955b337De404166C'
		const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
		const owner1Signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider)
		const ethAdapter = new EthersAdapter({
			ethers,
			signerOrProvider: owner1Signer
		})
		const safeSdk = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRES })
	
		const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
		const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapter })
	
		const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: {
		  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		  data: '0x',
		  value: ethers.utils.parseUnits('0.0005', 'ether').toString()
		}});
	
		const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
		const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
		const safeAddress = await safeSdk.getAddress();
	
		await safeService.proposeTransaction({
		  safeAddress,
		  safeTransactionData: safeTransaction.data,
		  safeTxHash,
		  senderAddress: await owner1Signer.getAddress(),
		  senderSignature: senderSignature.data,
		})
	
		const safeTransaction2 = await safeService.getTransaction(safeTxHash)
		const executeTxResponse = await safeSdk.executeTransaction(safeTransaction2)
		const receipt = await executeTxResponse.transactionResponse?.wait()
	
		console.log(receipt);
	}

	return (<>
		<header className="flex justify-end items-center text-black px-3 pt-3">
		  <IconButton onClick={() => {}}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
			  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
			</svg>
		  </IconButton>
		</header>
		<main className="flex flex-col items-center text-center text-black gap-1 h-full px-3 pb-3">
		  <div className="flex flex-col gap-1">
			<h2 className="text-4xl font-extrabold">0.00 ETH</h2>
			<WalletAddress address={"0xEaD69Bd3507E99427C49621c767eEd385f8E2E9f"}/>
		  </div>
		  <div className="flex gap-1 w-full px-5">
			<h4 className="w-full text-left font-bold">Tokens</h4>
			<IconButton onClick={() => loadBalances()} disabled={loading}>
			  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
				<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
			  </svg>
			</IconButton>
		  </div>
		  <ScrollShadow hideScrollBar className="w-full flex flex-col p-6 gap-2 -mt-5">
			{loading && (<>
			  <CoinItem loading={true}/>
			  <CoinItem loading={true}/>
			  <CoinItem loading={true}/>
			  <CoinItem loading={true}/>
			</>)}
			{!loading &&Object.keys(balances).map((key) => (<CoinItem key={key} name={key} balance={balances[key]} imgsrc="/icons/icon192.png"/>))}
		  </ScrollShadow>
		</main>
	</>);
}

export default MainPage;
