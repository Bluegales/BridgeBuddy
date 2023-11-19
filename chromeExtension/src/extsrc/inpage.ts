import { InpageProvider } from "./helpers/provider";
import { getUrl } from "../helper/utils";
import {v4 as uuidv4} from 'uuid';

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface EIP6963ProviderInfo {
	uuid: string;
	name: string;
	icon: string;
	rdns: string;
};
interface EIP6963ProviderDetail {
	info: EIP6963ProviderInfo;
	provider: any;
};
interface EIP6963AnnounceProviderEvent extends CustomEvent {
	type: "eip6963:announceProvider";
	detail: EIP6963ProviderDetail;
};
interface EIP6963RequestProviderEvent extends Event {
	type: "eip6963:requestProvider";
};

declare global {
	interface WindowEventMap {
		"eip6963:requestProvider": EIP6963RequestProviderEvent
	}
}

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

// /* ------------------------------ Create Wallet ----------------------------- */
const inpageProvider = new InpageProvider();
const provider = new Proxy(inpageProvider, {
	deleteProperty: () => true,
	get(target, propName: 'chainId' | 'networkVersion' | 'selectedAddress') {
		return (target as any)[propName];
	},
});

/* ---------------------------- Announce Provider --------------------------- */
async function announceProvider() {
	const info: EIP6963ProviderInfo = {
		uuid: uuidv4(),
		name: "BridgeWallet",
		icon: getUrl("/icons/icon192.png"),
		rdns: "com.bridge.wallet"
	};

	window.dispatchEvent(
		new CustomEvent("eip6963:announceProvider", {
			detail: Object.freeze({ info: {...info}, provider: provider }),
		}) as EIP6963AnnounceProviderEvent
	);
}

window.addEventListener(
	"eip6963:requestProvider",
	(event: EIP6963RequestProviderEvent) => {
		announceProvider();
	}
);
announceProvider();

export {};
