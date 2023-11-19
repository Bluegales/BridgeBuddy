import { useCookies } from "react-cookie";
import { ethers } from "ethers";

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

const storeData = async (items: {[key: string]: any}, storage: (val?: {[key: string]: any}) => {[key: string]: any} = (val) => {return {}}) => {
	if (chrome !== undefined && chrome.storage !== undefined) {
		console.log("Using chrome storage");
		await chrome.storage.local.set(items)
	} else {
		storage(items);
	}
}
const loadData = async (keys: string[], storage: (val?: {[key: string]: any}) => {[key: string]: any} = (val) => {return {}}) => {
	if (chrome !== undefined && chrome.storage !== undefined) {
		const result = await chrome.storage.local.get(keys);
		return keys.reduce((obj, key) => ({...obj, [key]: result[key]}), {});
	} else {
		return keys.reduce((obj, key) => ({...obj, [key]: storage()[key]}), {});
	}
}

const useStorage = () => {
	const [cookies, setCookie] = useCookies(['storage']);

	const ldata = async (keys: string[]) => {
		return await loadData(keys, (val) => {return cookies.storage ?? {}});
	}
	const sdata = (items: {[key: string]: any}) => {
		return storeData(items, (val) => {
			const data = {...(cookies.storage ?? {}), ...val};
			setCookie('storage', data);
			return data;
		});
	}
	return {ldata, sdata};
}

const getUrl = (path: string) => (chrome !== undefined && chrome.runtime !== undefined) ? chrome.runtime.getURL(path) : `http://localhost:3000${path}`;

const getChainData = async () => {
	const rpcs = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/rpcs.json").then(async (response) => response.json());
	const accounts = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/accounts.json").then(async (response) => response.json());
	const tokens = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/tokens.json").then(async (response) => response.json());
	const modules = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/modules.json").then(async (response) => response.json());
	for (var key in rpcs) {
		rpcs[key] = new ethers.providers.JsonRpcProvider(rpcs[key]);
	}
	return {rpcs, accounts, tokens, modules};
}

// const bridgeFunds = async (amount: number, inCoin: string, outCoin: string, privateKey: string) => {
// 	const chainData = await getChainData();
// 	const erc20Abi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/erc20_abi.json").then((response) => response.json());
// 	const abstractionAbi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/abstraction_abi.json").then((response) => response.json());

// 	for (var acc in chainData.accounts) {
// 		const address = chainData.accounts[acc];
// 		if (!Object.keys(chainData.rpcs).includes(acc)) continue;
// 		const provider = chainData.rpcs[acc];
// 		const signer = new ethers.Wallet(privateKey, provider);
// 		const ethAdapter = new EthersAdapter({ethers, signerOrProvider: signer});
// 		if (!Object.keys(chainData.tokens[inCoin]).includes(acc)) continue;
// 		const tokenAddress = chainData.tokens[inCoin][acc]["collateral"];

// 		const tokenConctract = new ethers.Contract(tokenAddress, erc20Abi, signer);
// 		if (amount <= parseFloat(ethers.utils.formatUnits(await tokenConctract.balanceOf(address), await tokenConctract.decimals()))) {
// 			let iface = new ethers.utils.Interface(["swap(address,address,uint256,uint256)"]);
// 			const encodedData = iface.encodeFunctionData("swap", [
// 				tokenAddress,
// 				0x1360c34ae91f3A0ee514FcFf31834901552260f3, // usdc
// 				amount,
// 				amount
// 			]);

// 			const safeSdk = await Safe.create({ ethAdapter, safeAddress: address });
// 			const safeService = new SafeApiKit({ txServiceUrl: "https://safe-transaction-goerli.safe.global", ethAdapter: ethAdapter })


// 			console.log(safeSdk.getBalance());
// 			break;
// 		}
// 	}

// 	const SAFE_ADDRES = '0xea49182d6557F8BD20Fe8c56955b337De404166C'
// 	const provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.public.blastapi.io'")
// 	const owner1Signer = new ethers.Wallet(privateKey, provider)
// 	const ethAdapter = new EthersAdapter({
// 		ethers,
// 		signerOrProvider: owner1Signer
// 	})
// 	const safeSdk = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRES })

// 	const safeService = new SafeApiKit({ txServiceUrl: "https://safe-transaction-goerli.safe.global", ethAdapter: ethAdapter })

// 	const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: {
// 	  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
// 	  data: '0x',
// 	  value: ethers.utils.parseUnits('0.0005', 'ether').toString()
// 	}});

// 	const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
// 	const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
// 	const safeAddress = await safeSdk.getAddress();

// 	await safeService.proposeTransaction({
// 	  safeAddress,
// 	  safeTransactionData: safeTransaction.data,
// 	  safeTxHash,
// 	  senderAddress: await owner1Signer.getAddress(),
// 	  senderSignature: senderSignature.data,
// 	})

// 	const safeTransaction2 = await safeService.getTransaction(safeTxHash)
// 	const executeTxResponse = await safeSdk.executeTransaction(safeTransaction2)
// 	const receipt = await executeTxResponse.transactionResponse?.wait()

// 	console.log(receipt);
// }

// const bridgeFunds = async (amount: number, inCoin: string, outCoin: string, privateKey: string) => {
// 	const chainData = await getChainData();
// 	const erc20Abi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/erc20_abi.json").then((response) => response.json());
// 	const abstractionAbi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/abstraction_abi.json").then((response) => response.json());

// 	const provider = chainData.rpcs["goerli"];
// 	const signer = new ethers.Wallet(privateKey, provider);
// 	const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
// 	const safeSdk = await Safe.create({ ethAdapter, safeAddress: chainData.accounts["goerli"] })
// 	const safeService = new SafeApiKit({ txServiceUrl: "https://safe-transaction-goerli.safe.global", ethAdapter: ethAdapter })
// 	const safeAddress = await safeSdk.getAddress();

// 	let swapIface = new ethers.utils.Interface(["function swap(address,address,uint256,uint256)"]);
// 	const encodedSwapData = swapIface.encodeFunctionData("swap", [
// 		chainData.tokens["WETH"]["goerli"]["router"],
// 		chainData.tokens["USDC"]["basegoerli"]["collateral"],
// 		amount,
// 		amount
// 	]);

// 	let abstractIface = new ethers.utils.Interface(["function bridgeExecute(address,uint32,address,address,bytes,uint256,address,address,address,uint256)"]);
// 	const encodedAbstractData = abstractIface.encodeFunctionData("bridgeExecute", [
// 		safeAddress,
// 		"84531",
// 		"0x0fEe1a117d942421886E337ec6c25a6EE7643060",
// 		"0x49cfd6Ef774AcAb14814D699e3F7eE36Fdfba932",
// 		encodedSwapData,
// 		"10000000000000000",
// 		"0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d",
// 		"0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
// 		"0x86EBd73E09D41332a0e153D800ebdA27274E3280",
// 		amount
// 	]);

// 	const safeTransaction = await safeSdk.createTransaction({ safeTransactionData: {
// 		// to: chainData.modules["goerli"],
// 		to: "0xa8373756FFfB218C47Ba2D7848E21a369b92C633",
// 		data: encodedAbstractData,
// 		value: ethers.utils.parseUnits('0.005', 'ether').toString(),
// 		operation: 0
// 	}})
// 	const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
// 	const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

// 	console.log(safeTransaction);

// 	await safeService.proposeTransaction({
// 		safeAddress,
// 		safeTransactionData: safeTransaction.data,
// 		safeTxHash,
// 		senderAddress: await signer.getAddress(),
// 		senderSignature: senderSignature.data,
// 	});

// 	const safeTransaction2 = await safeService.getTransaction(safeTxHash)
// 	const executeTxResponse = await safeSdk.executeTransaction(safeTransaction2)
// 	const receipt = await executeTxResponse.transactionResponse?.wait()
// 	console.log(receipt);
// }

const bridgeFunds = async (amount: number, inCoin: string, outCoin: string, privateKey: string) => {
	const chainData = await getChainData();
	const erc20Abi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/erc20_abi.json").then((response) => response.json());
	const abstractionAbi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/abstraction_abi.json").then((response) => response.json());

	const provider = chainData.rpcs["goerli"];
	const signer = new ethers.Wallet(privateKey, provider);

	let swapIface = new ethers.utils.Interface(["function swap(address,address,uint256,uint256)"]);
	const encodedSwapData = swapIface.encodeFunctionData("swap", [
		chainData.tokens["WETH"]["basegoerli"]["collateral"],
		chainData.tokens["USDC"]["basegoerli"]["collateral"],
		amount,
		1000000
	]);

	const abstractContract = new ethers.Contract(chainData.modules["goerli"], abstractionAbi, signer);
	const result = await abstractContract.bridgeExecute(
		chainData.accounts["goerli"],
		"84531",
		chainData.tokens["WETH"]["goerli"]["router"],
		"0x49cfd6Ef774AcAb14814D699e3F7eE36Fdfba932", //mailbox
		encodedSwapData,
		"10000000000000000", // protocolfee
		"0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d", // remoteSafe
		"0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // token
		"0x86EBd73E09D41332a0e153D800ebdA27274E3280", // remotetoken
		amount
	, {gasLimit: 1000000});
	console.log(await signer?.provider.waitForTransaction(result.hash));
}

export {getUrl, getChainData, storeData, loadData, useStorage, bridgeFunds};
