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
		icon: "data:image/png;base64,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",
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
