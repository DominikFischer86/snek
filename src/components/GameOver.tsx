type GameOverPropTypes = {
	handleRestart: () => void
}

const GameOver = ({ handleRestart }: GameOverPropTypes) => (
	<div className="game-over">
		<p>Snek Ded!</p>
		<button onClick={handleRestart}>
			Play again!
			<span className="left-eye"></span>
			<span className="right-eye"></span>
		</button>
	</div>
)

export default GameOver
