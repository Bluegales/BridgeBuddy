import { Avatar, Button, Input } from "@nextui-org/react";
import { error } from "console";
import { MutableRefObject, useRef, useState } from "react";
import { useUser } from "../contexts/user";

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

interface PasswordFieldProps {
	label: string;
	error?: string;
	placeholder: string;
	reff: MutableRefObject<HTMLInputElement>;
}
const PasswordField: React.FC<PasswordFieldProps> = ({label, error, placeholder, reff}) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<Input
			ref={reff}
			label={label}
			variant="bordered"
			isInvalid={error != ""}
			errorMessage={error}
			placeholder={placeholder}
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
	)
}

const RegistrationPage: React.FC = () => {
	const [passwordRepeatError, setPasswordRepeatError] = useState("");
	const [privateKeyError, setPrivateKeyError] = useState("");
	const passwordRepeatRef = useRef<HTMLInputElement>(null);
	const [passwordError, setPasswordError] = useState("");
	const privateKeyRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const { setData } = useUser();

	const onSubmit = () => {
		if (passwordRef.current.value === "") {
			setPasswordError("Password empty");
			return;
		} else {
			setPasswordError("");
		}
		if (passwordRef.current.value !== passwordRepeatRef.current.value) {
			setPasswordRepeatError("Passwords do not match");
			return;
		} else {
			setPasswordRepeatError("");
		}
		if (privateKeyRef.current.value === "") {
			setPrivateKeyError("Please enter PrivateKey");
		} else {
			setPrivateKeyError("");
		}
		setData(privateKeyRef.current.value, passwordRef.current.value)
	}

	return (
		<main className="flex flex-col gap-3 items-center justify-center text-black h-full p-3">
			<Avatar radius="full" src="/icons/icon192.png" className="w-20 h-20" />
			<h1 className="text-2xl font-extrabold">BridgeWallet - Registration</h1>
			<Input
				ref={privateKeyRef}
				isInvalid={privateKeyError != ""}
				errorMessage={privateKeyError}
				label="PrivateKey"
				variant="bordered"
				placeholder="Enter your PrivateKey"
			/>
			<PasswordField label="Password" placeholder="Enter your Password" error={passwordError} reff={passwordRef}/>
			<PasswordField label="Password Repeat" placeholder="Repeat your Password" error={passwordRepeatError} reff={passwordRepeatRef}/>
			<Button color="primary" size="md" className="w-full" onClick={onSubmit}>
				Register
			</Button>
		</main>
	)
}

export default RegistrationPage;
