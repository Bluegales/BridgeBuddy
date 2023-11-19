/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface EventDetails {
	type: string;
	data: any;
}

interface BackgroundEvent extends CustomEvent {
	type: "BackgroundRequest" | "BackgroundResponse" | "BackgroundEmit";
	detail: EventDetails;
};

declare global {
	interface WindowEventMap {
		BackgroundResponse: BackgroundEvent;
		BackgroundRequest: BackgroundEvent;
		BackgroundEmit: BackgroundEvent;
	}
}

/* -------------------------------------------------------------------------- */
/*                                    Main                                    */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Sends --------------------------------- */
export function sendMessage(type: string, data: any = {}, timeout: number = 5000): Promise<any> {
	window.dispatchEvent(new CustomEvent("BackgroundRequest", { detail: { type, data } }) as BackgroundEvent);
	return new Promise((resolve, reject) => {
		function handler(event: BackgroundEvent) {
			if (event.detail != null && event.detail.type !== type) return;
			// clearTimeout(timeoutId);
			window.removeEventListener("BackgroundResponse", handler);
			if (event.detail != null && event.detail.data != undefined) {
				resolve(event.detail.data);
			} else {
				resolve("null");
			}
		}

		// const timeoutId = setTimeout(() => {
		// 	window.removeEventListener("BackgroundResponse", handler);
		// 	reject(new Error("Timeout waiting for window event: BackgroundResponse"));
		// }, timeout);

		window.addEventListener("BackgroundResponse", handler);
	});
}

export function emitBackgroundEvent(type: string, data: any = {}) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id!, {type: "BackgroundEmit", detail: { type, data }});  
	});
}

/* -------------------------------- Recieves -------------------------------- */
export function recieveBackgroundRequest(callback: (data: EventDetails, sendResponse: (data: any) => void) => any) {
	chrome.runtime.onMessage.addListener((request: BackgroundEvent, sender, sendBackgroundResponse) => {
		if (request.type !== "BackgroundRequest") return;
		if (callback(request.detail, sendBackgroundResponse) === true) {
			return true;
		}
	});
}

export function recieveEmitEvent(callback: (data: EventDetails) => any) {
	window.addEventListener("BackgroundEmit", (event: BackgroundEvent) => {
		callback(event.detail);
	});
}

/* --------------------------------- Relayer -------------------------------- */
export function relayer() {
	window.addEventListener("BackgroundRequest", function(event) {
		chrome.runtime.sendMessage({type: event.type, detail: {...event.detail}}, (response: any) => {
			console.log("Content - Sending message", response, "for", event.detail);
			window.dispatchEvent(new CustomEvent("BackgroundResponse", { detail: { type: event.detail.type, data: response} }) as BackgroundEvent);
		});
	});

	chrome.runtime.onMessage.addListener((event: BackgroundEvent, sender, sendResponse) => {
		if (event.type !== undefined && event.type !== "BackgroundEmit") return;
		window.dispatchEvent(new CustomEvent("BackgroundEmit", { detail: event.detail }) as BackgroundEvent);
	});
}
