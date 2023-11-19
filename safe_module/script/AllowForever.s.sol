// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract AllowForever is Script {
	function run() external {
		uint256 deployerPrivateKey = vm.envUint("PATRICK_PRIVATE_KEY");
		// address deployerAddress = vm.envAddress("PATRICK_PUBLIC_KEY");

		// address safe_goerli = vm.envAddress("SAFE_GOERLI");
		address safe_basegoerli = vm.envAddress("SAFE_BASEGOERLI");
		// address safe_alfajores = vm.envAddress("SAFE_ALFAJORES");

		// address weth_goerli_router = vm.envAddress("WETH_GOERLI_ROUTER");
		// address weth_goerli = vm.envAddress("WETH_GOERLI");
		address weth_basegoerli = vm.envAddress("WETH_BASEGOERLI");
		// address weth_alfajores = vm.envAddress("WETH_ALFAJORES");
		// IERC20 cntrct_weth_goerli = IERC20(weth_goerli);
		IERC20 cntrct_weth_basegoerli = IERC20(weth_basegoerli);
		// IERC20 cntrct_weth_alfajores = IERC20(weth_alfajores);

		// address usdc_goerli_router = vm.envAddress("USDC_GOERLI_ROUTER");
		// address usdc_goerli = vm.envAddress("USDC_GOERLI");
		address usdc_basegoerli = vm.envAddress("USDC_BASEGOERLI");
		// address usdc_alfajores = vm.envAddress("USDC_ALFAJORES");
		// IERC20 cntrct_usdc_goerli = IERC20(usdc_goerli);
		IERC20 cntrct_usdc_basegoerli = IERC20(usdc_basegoerli);
		// IERC20 cntrct_usdc_alfajores = IERC20(usdc_alfajores);

		address swap = vm.envAddress("SWAP");

		uint256 uint_max = type(uint256).max;

		vm.startBroadcast(safe_basegoerli);

		// cntrct_weth_goerli.approve(safe_goerli, uint_max);
		cntrct_weth_basegoerli.approve(swap, uint_max);
		// cntrct_weth_alfajores.approve(safe_alfajores, uint_max);
		// cntrct_usdc_goerli.approve(safe_goerli, uint_max);
		cntrct_usdc_basegoerli.approve(swap, uint_max);
		// cntrct_usdc_alfajores.approve(safe_alfajores, uint_max);

		vm.stopBroadcast();
	}
}