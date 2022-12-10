type ControlsPropTypes = {
	onClickHandler: any
	activeKey: string
}

const Controls = ({ onClickHandler, activeKey }: ControlsPropTypes) => {
	const controlOptions = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]

	return (
		<div className="mobile-controls">
			{controlOptions.map((option: string) => (
				<button
					disabled={option === activeKey}
					key={option}
					className={option}
					onClick={onClickHandler}
				/>
			))}
		</div>
	)
}

export default Controls
