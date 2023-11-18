// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
// https://github.com/0xminer11/mumbai-hyperlane/blob/main/src/consts/tokens.json
// v3 hypERC20 address
address constant HYPERC20_ADDRESS = 0x4982051409D3F7f1C37d9f1e544EF6c6e8557148;
// v2 hypERC20 address
// address constant HYPERC20_ADDRESS = 0x184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000;
// Goerli WETH
address constant WETH_ADDRESS = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
// Basegoerli & Alfajores WETH
address constant ALT_WETH_ADDRESS = 0x4982051409D3F7f1C37d9f1e544EF6c6e8557148;
uint32 constant MUMBAI_CHAIN_ID = 80001;
uint32 constant FUJI_CHAIN_ID = 43113;
uint32 constant MOONBASE_CHAIN_ID = 1287;
uint32 constant BASEGOERLI_CHAIN_ID = 84531;
uint32 constant ALJAFORES_CHAIN_ID = 44787;
// IMailbox mailbox = IMailbox(0x35231d4c2D8B8ADcB5617A638A0c4548684c7C70);
// IInterchainGasPaymaster igp = IInterchainGasPaymaster(
//     0x56f52c0A1ddcD557285f7CBc782D3d83096CE1Cc
// );
/// @notice An interchain extension of the ERC20 interface
interface IHypERC20 is IERC20 {
  /**
    * @notice Transfers tokens to the specified recipient on a remote chain
    * @param _destination The domain ID of the destination chain
    * @param _recipient The address of the recipient, encoded as bytes32
    * @param _amount The amount of tokens to transfer
    */
  function transferRemote(
    uint32 _destination,
    bytes32 _recipient,
    uint256 _amount
  ) external payable;
}
contract BridgeHypERC20 is Script {
    function getCollateral(address addr) external view returns (uint256) {
        return IHypERC20(HYPERC20_ADDRESS).balanceOf(addr);
    }
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.envAddress("PUBLIC_KEY");
        IERC20 weth = IERC20(ALT_WETH_ADDRESS);
        // vm.prank(WETH_ADDRESS);
        // weth.transfer(deployerAddress2, 1000);
        console2.log("WETH balance: %d", this.getCollateral(deployerAddress));
        vm.startBroadcast(deployerPrivateKey);

        weth.approve(HYPERC20_ADDRESS, 10000);

        
        IHypERC20 hyperc20 = IHypERC20(HYPERC20_ADDRESS);
        bytes32 addr = bytes32(uint256(uint160(deployerAddress)));
        hyperc20.transferRemote{value: 1000000000000000}(ALJAFORES_CHAIN_ID, addr, 10000);
        vm.stopBroadcast();
    }
}