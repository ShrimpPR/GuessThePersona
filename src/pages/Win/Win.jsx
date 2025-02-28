import { useEffect, useState } from "react";
import styles from "./Win.module.css";

const Win = ({ onClose }) => {
	const [message, setMessage] = useState("Chargement...");

    useEffect(() => {
        const fetchData = async () => {
            try {
				const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/getconseil2`, {
					method: "POST",
					headers: {
						"x-api-key": "testapikey",
					},
					body: JSON.stringify({ theme: "finances" }),
                });

				if (!response.ok) {
					throw new Error("Erreur lors de la récupération des données");
				}
                const data = await response.json();
				console.log("responsegetconseil", data.response);
                setMessage(data.response || "Réponse reçue !");
            } catch (error) {
                setMessage("Erreur lors du chargement du message.");
            }
        };

		fetchData();
	}, []);

	return (
		<div className={styles.winOverlay}>
			<div className={styles.winContainer}>
				<h2>🎉 Félicitations ! 🎉</h2>
				<p>{message}</p>
				<button className={styles.closeButton} onClick={onClose}>
					Fermer
				</button>
			</div>
		</div>
	);
};

export default Win;