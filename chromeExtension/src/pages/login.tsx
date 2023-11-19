import { Avatar, Input } from "@nextui-org/react";
import { useUser } from "../contexts/user";
import React, { useState } from "react";
import Head from "next/head";

const EyeVisible = ({className = ""}) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-6 h-6 " + className}>
		<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
		<path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
	</svg>

)
const EyeSlashVisible = ({className = ""}) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-6 h-6 " + className}>
		<path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
		<path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
		<path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
	</svg>
)

interface LoginPageProps {
}
const LoginPage: React.FC<LoginPageProps> = () => {
	const { setLocked, password } = useUser();
	const [isVisible, setIsVisible] = useState(false);
	const [error, setError] = useState("");

	const toggleVisibility = () => setIsVisible(!isVisible);

	const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== "Enter") {
			setError("");
			return;
		}
		if ((e.target as HTMLInputElement).value !== password) {
			setError("Incorrect password");
			return;
		}
		setLocked(false);
	}

	return (<>
		<Head>
        	<title>BridgeWallet Login</title>
      	</Head>
		<main className="flex flex-col gap-5 items-center justify-center text-black h-full p-3">
			<Avatar radius="full" src="/icons/icon192.png" className="w-20 h-20" />
			<h1 className="text-2xl font-extrabold">BridgeWallet</h1>
			<Input 
				label="Password"
				variant="bordered"
				onKeyDown={keyHandler}
				placeholder="Enter your password"
				isInvalid={error !== ""}
				errorMessage={error}
				endContent={
					<button className="focus:outline-none" type="button" onClick={toggleVisibility}>
					  {isVisible ? (
						  <EyeSlashVisible className="text-2xl text-default-400 pointer-events-none" />
						  ) : (
							  <EyeVisible className="text-2xl text-default-400 pointer-events-none" />
							  )}
					</button>
				}
				type={isVisible ? "text" : "password"}
			/>
		</main>
	</>)
}
export default LoginPage;
