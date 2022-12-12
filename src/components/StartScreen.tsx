type StartScreenPropTypes = {
	handleGameStart: () => void
}

const StartScreen = ({ handleGameStart }: StartScreenPropTypes) => (
	<div className="start-screen">
		<h1>Snek!</h1>
		<button onClick={handleGameStart}>Start Game</button>
	</div>
)

export default StartScreen
