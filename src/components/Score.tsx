type ScorePropTypes = {
	score: number
	highScore: number
	scoreRef: any
}

const Score = ({ score, highScore, scoreRef }: ScorePropTypes) => (
	<div ref={scoreRef} className="score">
		<p>Score: {score}</p>
		<p>Highscore: {highScore}</p>
	</div>
)

export default Score
