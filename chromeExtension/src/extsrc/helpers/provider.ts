import { emitBackgroundEvent, recieveBackgroundRequest, recieveEmitEvent, sendMessage } from './backgroundConnector';
import { EventEmitter } from 'events';

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface ProviderRpcError extends Error {
	message: string;
	code: 4001 | 4100 | 4200 | 4900 | 4901;
	data?: unknown;
}
interface RequestArguments {
	readonly method: string;
	readonly params?: readonly unknown[] | object;
}
interface CustomWallet {
	request(args: RequestArguments): Promise<unknown>;
	on(event: string, listener: (...args: any[]) => void): void;
	removeListener(event: string, listener: (...args: any[]) => void): void;
	// send(...args: unknown[]): unknown;
	// sendAsync(request: Object, callback: Function): void;
}

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

/* ----------------------------- InpageProvider ----------------------------- */
export class InpageProvider extends EventEmitter implements CustomWallet {
	constructor() {
		super();
		console.log("InpageProvider constructor");
		recieveEmitEvent((data) => {
			console.log("InpageProvider emit", data);
			this.emit(data.type, data.data);
		});
	}

	async request(args: RequestArguments): Promise<unknown> {
		const response = await sendMessage(args.method, args.params);
		console.log("InpageProvider request", args, response);
		return response;
	}
}

/* ----------------------------- WalletProvider ----------------------------- */
export class WalletProvider extends EventEmitter implements CustomWallet {
	_chainId: string = "0x2105";
	_accounts: string[] = ["0xea49182d6557F8BD20Fe8c56955b337De404166C"];

	constructor() {
		super();
		console.log("WalletProvider constructor");
		recieveBackgroundRequest((data, sendResponse) => {
			this.request({ method: data.type, params: data.data }).then((responsedata) => {
				console.log("Background - Sending message", responsedata, "for", data);
				sendResponse(responsedata);
			});
			return true;
		});

	}

	emit(eventName: string | symbol, args?: any): boolean {
		console.log("WalletProvider emit", eventName, args);
		emitBackgroundEvent(eventName.toString(), args);
		return super.emit(eventName, args);
	}

	async request(args: RequestArguments): Promise<unknown> {
		console.log("WalletProvider request", args);
		if (args.method == "eth_requestAccounts") {
			this.emit("connect", {chainId: await this.request({method: "eth_chainId"})});
			return await this.request({method: "eth_accounts"});
		}
		else if (args.method == "eth_accounts") {
			return this._accounts;
		}
		else if (args.method == "eth_chainId") {
			return this._chainId;
		}
		else if (args.method == "eth_call") {
			const window = await chrome.windows.getLastFocused()
			const newWindow = await chrome.windows.create({
				url: "/signpage.html",
				type: 'popup',
				width: 370,
				height: 600,
				left: window.width - (370 / 2),
				top: 0
			});
			try {
				await new Promise<void>((resolve, reject) => {
					const onTabClose = (tabId , info) => {
						if (tabId == newWindow.tabs[0].id) {
							chrome.runtime.onMessage.removeListener(waitForExtension);
							chrome.tabs.onRemoved.removeListener(onTabClose);
							reject();
						}
					};
					const waitForExtension = (message, sender, sendResponse) => {
						if (message.type !== "windowConnection") return;
						chrome.runtime.onMessage.removeListener(waitForExtension);
						chrome.tabs.onRemoved.removeListener(onTabClose);
						resolve();
					};
					chrome.runtime.onMessage.addListener(waitForExtension);
					chrome.tabs.onRemoved.addListener(onTabClose);
				});
				return await new Promise(async (resolve, reject) => {
					const onTabClose = (tabId , info) => {
						if (tabId == newWindow.tabs[0].id) {
							chrome.tabs.onRemoved.removeListener(onTabClose);
							reject();
						}
					};
					chrome.tabs.onRemoved.addListener(onTabClose);

					resolve(await chrome.tabs.sendMessage(newWindow.tabs[0].id, {...args}));
				});
			} catch {
				return;
			}
		}

		else if (args.method == "wallet_switchEthereumChain") {
			if (args.params) {
				this._chainId = (args.params as Array<string>)[0]["chainId" as any];
				this.emit("chainChanged", this._chainId);
			}
		}
	}
}
