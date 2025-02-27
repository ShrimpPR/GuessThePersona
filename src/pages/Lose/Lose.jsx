import { useCallback, useEffect } from "react";
import styles from "./Lose.module.css";
import Menu from "../../components/Menu/Menu";
import supabase from "../../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const Lose = () => {
	const navigate = useNavigate();

	const fetchUserData = useCallback(async () => {
		const { data } = await supabase.auth.getUser();
		const user = data?.user;

		if (!user) {
			navigate("/login");
			return;
		}
	}, [navigate]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const handleRedirect = (url) => {
		window.location.href = url;
	};

	return (
		<div className={styles.LoseContainer}>
			<Menu handleRedirect={handleRedirect} />

			<div className={styles.LoseContent}>
				<h1 className={styles.title}>OUPS <span className={styles.error}>RATÉ</span></h1>
				<div className={styles.messageContainer}>
					<div className={styles.speechBubble}>
						Raté ! J’espérais un adversaire à ma hauteur... On retente demain ?
					</div>
				</div>
			</div>
		</div>
	);
};

export default Lose;