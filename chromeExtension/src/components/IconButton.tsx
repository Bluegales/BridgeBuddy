/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

interface IconButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, disabled }) => {
	return (
		<button disabled={disabled} className="transition hover:opacity-60 disabled:opacity-60" onClick={disabled ? () => {} : onClick}>
			{children}
		</button>
	)
}

export default IconButton;