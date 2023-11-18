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
	try {
        const rpcs = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/rpcs.json").then(async (response) => response.json());
        const accounts = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/accounts.json").then(async (response) => response.json());
        const tokens = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/tokens.json").then(async (response) => response.json());
        for (var key in rpcs) {
          rpcs[key] = new ethers.providers.JsonRpcProvider(rpcs[key]);
        }
        return {rpcs, accounts, tokens};
	} catch (error) {
        console.error("Error fetching data:", error);
	}
}

export {getUrl, getChainData, storeData, loadData, useStorage};
