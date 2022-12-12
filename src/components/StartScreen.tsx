type StartScreenPropTypes = {
	handleGameStart: () => void
}

const StartScreen = ({ handleGameStart }: StartScreenPropTypes) => (
	<div className="start-screen">
		<h1>Snek!</h1>
		<button onClick={handleGameStart}>
			Start Game
			<span className="left-eye"></span>
			<span className="right-eye"></span>
		</button>
	</div>
)

export default StartScreen
