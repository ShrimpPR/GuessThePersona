import { useEffect, useState } from "react";
import styles from "./Win.module.css";
import FortuneWheel from "../../components/FortuneWheel/FortuneWheel";

const Win = ({ onClose }) => {
	const [message, setMessage] = useState("Chargement...");
	const [wheelResult, setWheelResult] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!wheelResult) return;
			try {
				const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/getconseil2`,
					{
						method: "POST",
						headers: {
							"x-api-key": "testapikey",
						},
						body: JSON.stringify({ theme: wheelResult }),
					});

				if (!response.ok) {
					throw new Error("Erreur lors de la récupération des données");
				}
				const data = await response.json();
				// console.log("responsegetconseil", data.response);
				setMessage(data.response || "Réponse reçue !");
			} catch (error) {
				setMessage("Erreur lors du chargement du message.", error);
			}
		};

		fetchData();
	}, [wheelResult]);

	const handleSpinResult = (result) => {
		setWheelResult(result);
	};

	return (
		<div className={styles.winOverlay}>
			<div className={styles.winContainer}>
				<h2>🎉 Félicitations ! 🎉</h2>
				<FortuneWheel onSpinResult={handleSpinResult} />
				<h2>Voici un conseil pour vous :</h2>
				<br />
				<p>{message}</p>
				<button className={styles.closeButton} onClick={onClose}>
					Fermer
				</button>
			</div>
		</div>
	);
};

export default Win;