import { Spinner } from "@nextui-org/react"

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const LoadingPage: React.FC = () => {
	return(
		<main className="flex flex-col h-full justify-center">
			<Spinner size="lg" />
		</main>
	)
}

export default LoadingPage;
