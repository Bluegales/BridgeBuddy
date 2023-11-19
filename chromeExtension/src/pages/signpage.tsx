import { bridgeFunds } from '../helper/utils';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/user';
import { Button, Spinner } from '@nextui-org/react';
import Head from 'next/head';

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const SignPage: React.FC = () => {
	const { locked, privateKey } = useUser();
	const [loading, setLoading] = useState(false);
	const [ approveData, setApproveData ] = useState({
		from: "",
		to: "",
		rpc: {},
		response: (data?: any) => {}
	})

	useEffect(() => {
		if (locked) return;
		if (chrome.runtime == undefined) return;
		chrome.runtime.sendMessage({type: "windowConnection"});
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			const data = request.params[0];
			setApproveData({from: data.from, to: data.to, rpc: request, response: sendResponse})
			return true;
		});
	}, []);

	const onApprove = async () => {
		setLoading(true);
		await bridgeFunds(1, "WETH", "USDC", privateKey);
		approveData.response();
		setLoading(false);
		window.close();
	}
	const onReject = () => {
		approveData.response();
		window.close();
	}

	if (loading) return (
		<main className="flex flex-col items-center justify-center h-full">
			<Spinner size="lg" />
		</main>
	)

	return (<>
		<Head>
        	<title>BridgeWallet Notification</title>
      	</Head>
		{loading && <main className="flex flex-col items-center justify-center h-full">
			<Spinner size="lg" />
		</main>}
		{!loading && <main className="flex h-full flex-col items-center justify-between text-black p-5 gap-2">
			<h1 className="text-2xl text-center font-bold w-full">Approve Call</h1>
			<div className="w-full">
				<p className="font-bold">From: <span className="font-normal">{approveData.from}</span></p>
				<p className="font-bold">To: <span className="font-normal">{approveData.to}</span></p>
			</div>
			<div className="flex justify-between w-full">
				<Button onClick={onReject}>
					Reject
				</Button>
				<Button color="primary" onClick={onApprove}>
					Approve
				</Button>
			</div>
		</main>}
	</>)
}

export default SignPage;
