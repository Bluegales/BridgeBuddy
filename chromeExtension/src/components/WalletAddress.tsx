import { Code, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

interface WalletAddressProps {
	address: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const WalletAddress: React.FC<WalletAddressProps> = ({address}) => {
	const [isOpen, setIsOpen] = useState(false);
  
	const copyAddress = () => {
	  navigator.clipboard.writeText(address as string);
	}
  
	return (
	  <Popover shouldCloseOnBlur placement="bottom" color="success" triggerScaleOnOpen={false} isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
		<PopoverTrigger onMouseLeave={() => setIsOpen(false)}>
		  <Code color="primary" className="transition cursor-pointer inline-flex align-middle gap-1 hover:opacity-70" onClick={copyAddress}>
			{ address.substring(0, 7) + "..." + address.substring(address.length - 5) }
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
			  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
			  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
			</svg>
		  </Code>
		</PopoverTrigger>
		<PopoverContent className="p-1 opacity-80">
		  <div className="px-1 py-2">
			<div className="text-small font-bold">Successfully copied to clipboard!</div>
		  </div>
		</PopoverContent>
	  </Popover>
	)
}

export default WalletAddress;
