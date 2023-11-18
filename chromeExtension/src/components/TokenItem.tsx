
import { Card, CardBody, Avatar, Skeleton } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

interface CoinItemProps {
	name?: string;
	balance?: number;
	imgsrc?: string;
	loading?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const CoinItem: React.FC<CoinItemProps> = ({name, balance, imgsrc, loading}) => {
	if ((loading !== undefined && loading) || !name || !balance || !imgsrc) return (
		<div>
			<Card className="w-full">
				<CardBody>
					<div className="flex justify-between">
						<Skeleton className="rounded-full">
							<Avatar radius="full" size="md" />
						</Skeleton>
						<div className="flex justify-center items-center">
							<Skeleton className="rounded-lg">  
								<div className="h-5 w-48 rounded-lg bg-default-300"></div>
							</Skeleton>
							<span className="w-1"/>
							<Skeleton className="rounded-lg">  
								<div className="h-5 w-12 rounded-lg bg-default-300"></div>
							</Skeleton>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	)

	return (
	  <div>
		<Card className="w-full">
		  <CardBody>
			<div className="flex justify-between">
			  <Avatar radius="full" size="md" src={imgsrc} />
			  <div className="flex justify-center items-center">
			  	<h4 className="text-xl text-right w-48 font-semibold leading-none text-default-700 truncate">{balance}</h4>
				<span className="w-1"/>
				<h4 className="w-12 text-right text-small font-semibold leading-none text-default-900 uppercase truncate">{name}</h4>
			  </div>
			</div>
		  </CardBody>
		</Card>
	  </div>
	)
}

export default CoinItem;
