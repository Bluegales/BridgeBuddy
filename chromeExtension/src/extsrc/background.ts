import { WalletProvider } from "./helpers/provider";

/* ---------------------------- Register Injector --------------------------- */
const registerInPageContentScript = async () => {
	try {
		await chrome.scripting.registerContentScripts([{
			id: 'inpage',
			matches: ['file://*/*', 'http://*/*', 'https://*/*'],
			js: ['inpage.js'],
			runAt: 'document_start',
			world: 'MAIN'
		}]);
	} catch (error) {
		console.warn(`Dropped attempt to register inpage content script. ${error}`);
	}
}
registerInPageContentScript();

/* ---------------------------------- Main ---------------------------------- */
const walletProvider = new WalletProvider();
