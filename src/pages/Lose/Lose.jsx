import styles from "./Lose.module.css";

const Lose = () => {
	return (
		<div className={styles.loseOverlay}>
			<div className={styles.loseContainer}>
				<h2> Perdu ! </h2>
				<p>Retente ta chance demain !</p>
			</div>
		</div>
	);
};

export default Lose;