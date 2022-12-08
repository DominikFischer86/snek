type ScorePropTypes = {
	score: number
	level: number
}

const Score = ({ score, level }: ScorePropTypes) => (
	<div className="score">
		<p>Score: {score}</p>
		<p>Level: {level}</p>
	</div>
)

export default Score
