type ScorePropTypes = {
	score: number
	level: number
	highScore: number
}

const Score = ({ score, level, highScore }: ScorePropTypes) => (
	<div className="score">
		<p>Level: {level}</p>
		<p>Score: {score}</p>
		<p>Highscore: {highScore}</p>
	</div>
)

export default Score
