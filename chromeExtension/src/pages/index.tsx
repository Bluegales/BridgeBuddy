import {Avatar, Button, Card, CardBody, Code, Input, Popover, PopoverContent, PopoverTrigger, ScrollShadow, Skeleton} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import LoginPage from "./login";
import { ethers } from 'ethers';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'

const getUrl = (path: string) => (window !== undefined && chrome.runtime !== undefined) ? chrome.runtime.getURL(path) : `http://localhost:3000${path}`;

interface CoinItemProps {
  name: string;
  wallets: {[network: string]: string};
  contracts: {[network: string]: string};
  providers: {[network: string]: ethers.providers.JsonRpcProvider};
  imgsrc: string;
}
const CoinItem: React.FC<CoinItemProps> = ({name, wallets, contracts, providers, imgsrc}) => {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      const erc20Abi = await fetch(getUrl('/erc20abi.json')).then((response) => response.json());
      setBalance(await Object.keys(contracts).reduce(async (accumulatedPromise, network) => {
        const accumulated = await accumulatedPromise;

        console.log(process.env.NEXT_PUBLIC_PRIVATE_KEY);
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, providers[network]);
        const contract = new ethers.Contract(contracts[network], erc20Abi, signer)

        return accumulated + parseFloat(ethers.utils.formatUnits(await contract.balanceOf(wallets[network]), await contract.decimals()));
      }, Promise.resolve(0)));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <Card className="w-full">
        <CardBody>
          <div className="flex justify-between">
            <Avatar radius="full" size="md" src={imgsrc} />
            <div className="flex justify-center items-center">
              {loading ? (
                <Skeleton className="rounded-lg">  
                  <div className="h-5 w-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              ) : (
                <h4 className="text-xl text-right w-58 font-semibold leading-none text-default-700 truncate">{balance}</h4>
              )}
              <span className="w-1"/>
              <h4 className="w-12 text-right text-small font-semibold leading-none text-default-900 uppercase truncate">{name}</h4>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

interface WalletAddressProps {
  address: string;
}
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

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [chainData, setChainData] = useState({
    rpcs: {},
    accounts: {},
    tokens: {}
  });

  useEffect(() => {
    (async () => {
      try {
        const rpcs = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/rpcs.json").then(async (response) => response.json());
        const accounts = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/accounts.json").then(async (response) => response.json());
        const tokens = await fetch("https://raw.githubusercontent.com/Bluegales/BridgeBuddy/main/info/tokens.json").then(async (response) => response.json());
        for (var key in rpcs) {
          rpcs[key] = new ethers.providers.JsonRpcProvider(rpcs[key]);
        }
        setChainData({
          rpcs: rpcs,
          accounts: accounts,
          tokens: tokens
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  if (!loggedIn) return (<LoginPage onLogin={() => setLoggedIn(true)}/>);

  return (<>
    <header className="flex justify-end items-center text-black px-3 pt-3">
      <button className="transition hover:opacity-60" onClick={() => setLoggedIn(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
        </svg>
      </button>
    </header>
    <main className="flex flex-col items-center text-center text-black gap-1 h-full px-3 pb-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-extrabold">0.00 ETH</h2>
        <WalletAddress address={"0xEaD69Bd3507E99427C49621c767eEd385f8E2E9f"}/>
      </div>
      <ScrollShadow hideScrollBar className="w-full flex flex-col gap-2 p-6">
        {Object.keys(chainData.tokens).map((key) => {
          const coinName = key;
          const coinContracts = Object.keys(chainData.tokens[key]).reduce((result, contractChain) => {
            result[contractChain] = chainData.tokens[key][contractChain]["collateral"];
            return result;
          }, {});
          return (<CoinItem key={coinName} name={coinName} wallets={chainData.accounts} contracts={coinContracts} providers={chainData.rpcs} imgsrc="/icons/icon192.png"/>);
        })}
      </ScrollShadow>
      <Button>
        Call Function
      </Button>
    </main>
  </>);
}
