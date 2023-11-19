import { createContext, useContext, useEffect, useState } from "react";
import { useStorage } from "../helper/utils";
import { Spinner } from "@nextui-org/react";
import { useRouter } from 'next/router';
import { NextPage } from "next";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

type ContextType = {
	locked: boolean;
	setLocked: (locked: boolean) => void;
	privateKey: null | string;
	password: null | string;
	setData: (privateKey: string, password: string) => Promise<void>;
};

/* -------------------------------------------------------------------------- */
/*                              Context Provider                              */
/* -------------------------------------------------------------------------- */

const UserContext = createContext<ContextType>({} as ContextType);

interface Props {
  children: React.ReactNode;
}
const UserProvider: NextPage<Props> = ({ children }) => {
	const [privateKey, setPrivateKey] = useState<null | string>(null);
	const [password, setPassword] = useState<null | string>(null);
	const [routePage, setRoutePage] = useState<null | string>(null);
	const [locked, setLocked] = useState<boolean>(true);
	const [loading, setLoading] = useState(true);
	const { ldata, sdata } = useStorage();
	const router = useRouter();

	if (routePage === null) {
		const path = router.asPath.replace(".html", "").replace("/index", "/");
		if (path === "/login") {
			setRoutePage("/");
		} else {
			setRoutePage(path);
		}
	}

	useEffect(() => {
		(async () => {
			setLoading(true);
			const {privateKey, password} = await ldata(["privateKey", "password"]) as {privateKey: string | undefined, password: string | undefined};
			if (privateKey == undefined || password == undefined) {
				router.replace("/registration");
				setLoading(false);
				return;
			}
			setPrivateKey(privateKey);
			setPassword(password);
			setLocked(true);
			router.replace("/login");
			setLoading(false);
		})();
	}, []);

	useEffect(() => {
		if (loading) return;
		if (privateKey === null && password === null) {
			router.replace("/registration");
			return;
		}
		if (locked) router.replace("/login");
		if (!locked) router.replace(routePage);
	}, [locked]);

	const setData = async (privateKey: string = "", password: string = "") => {
		setLoading(true);
		await sdata({privateKey, password});
		setPrivateKey(privateKey);
		setPassword(password);
		setLocked(true);
		router.replace("/login");
		setLoading(false);
	}

	if (loading) return (
		<main className="flex flex-col h-full justify-center">
			<Spinner size="lg" />
		</main>
	)

	return (
		<UserContext.Provider value={{ locked, setLocked, privateKey, password, setData }}>
			{children}
		</UserContext.Provider>
	);
};
export default UserProvider;

/* -------------------------------------------------------------------------- */
/*                                    Hook                                    */
/* -------------------------------------------------------------------------- */

export const useUser = () => useContext(UserContext);
