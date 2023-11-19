import { Avatar, Button, Card, CardBody, Input, Slider, Spinner } from "@nextui-org/react";
import { useWeb3ModalSigner } from '@web3modal/ethers5/react';
import { useRef, useState } from "react";
import { toast } from 'react-toastify';
import { ethers } from "ethers";

const USDC_ADDRESS = "0x1360c34ae91f3A0ee514FcFf31834901552260f3";
const WETH_ADDRESS = "0x4982051409D3F7f1C37d9f1e544EF6c6e8557148";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const Home = () => {
  const { signer } = useWeb3ModalSigner();
  const usdcRef = useRef<HTMLInputElement>(null);
  const wethRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const swap = (inAddress: string, outAddress: string) => {
    const transactionPromise = new Promise<void>(async (resolve, reject) => {
      setLoading(true);

      try {
        console.log("swap", parseFloat(usdcRef.current?.value || "0"), parseFloat(wethRef.current?.value || "0"));
        const swapInfo = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/mainnet/info_mainnet/swap.json").then((response) => response.json());
        const erc20Abi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/mainnet/info/erc20_abi.json").then((response) => response.json());
        const swapAbi = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/mainnet/info/swap_abi.json").then((response) => response.json());

        const token1Contract = new ethers.Contract(inAddress, erc20Abi, signer);
        const approveResult = await token1Contract.approve(swapInfo["address"], ethers.utils.parseUnits(wethRef.current?.value || "0", await token1Contract.decimals()));
        await signer?.provider.waitForTransaction(approveResult.hash);
        console.log(approveResult);
        const token2Contract = new ethers.Contract(outAddress, erc20Abi, signer);
        const contract = new ethers.Contract(swapInfo["address"], swapAbi, signer);
        const swapResult = await contract.swap(inAddress, outAddress, ethers.utils.parseUnits(wethRef.current?.value || "0", await token1Contract.decimals()), ethers.utils.parseUnits(usdcRef.current?.value || "0", await token2Contract.decimals()));
        await signer?.provider.waitForTransaction(swapResult.hash);
        resolve();
      } catch (error) {
        console.log(error);
        reject();
      }

      setLoading(false);
    });
    // toast.promise(
    //   transactionPromise,
    //   {
    //     pending: 'Executing transaction... 🚀',
    //     success: 'Transaction completed 🥳',
    //     error: 'Transaction failed 😰'
    //   },
    //   {position: toast.POSITION.BOTTOM_RIGHT, theme: "dark"}
    // )
  }

  return (
    <main className="h-screen dark text-foreground bg-background">
      <div className="flex justify-end w-full p-5 absolute">
        <w3m-button />
      </div>
      <div className="h-full flex flex-col items-center justify-center gap-5">
        <Avatar className="w-32 h-32" src="/icon.png"/>
        <h1 className="text-4xl font-bold">A Base Exclusive DEX</h1>
        <Card>
          <CardBody className="gap-5 w-screen max-w-xl p-5">
            <Input ref={wethRef} type="number" label="WETH" className="w-full" isDisabled={!signer || loading}/>
            <Input ref={usdcRef} type="number" label="USDC" className="w-full" isDisabled={!signer || loading}/>
            <Button size="lg" color="primary" className="w-full" onClick={() => swap(WETH_ADDRESS, USDC_ADDRESS)} isDisabled={!signer || loading}>
              SWAP
            </Button>
          </CardBody>
        </Card>
        {/* <Slider
          size="lg"
          step={0.5}
          color="foreground"
          aria-label="steps"
          showSteps={true} 
          maxValue={1} 
          minValue={0} 
          defaultValue={0}
          className="max-w-md"
          isDisabled={true}
        /> */}
      </div>
    </main>
  )
}

export default Home;
