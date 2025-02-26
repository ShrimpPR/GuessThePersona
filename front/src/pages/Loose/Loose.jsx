import { useCallback, useEffect } from "react";
import styles from "./Loose.module.css";
import Menu from "../../components/Menu/Menu";
import supabase from "../../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const Loose = () => {
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
		<div className={styles.LooseContainer}>
			<Menu handleRedirect={handleRedirect} />

			<div className={styles.LooseContent}>
				<h1 className={styles.title}>OUPS <span className={styles.error}>RATÉ</span></h1>
				<div className={styles.messageContainer}>
					<div className={styles.speechBubble}>
						Raté ! J’espérais un adversaire à ma hauteur... On retente demain ?
					</div>
					<div className={styles.blurredAvatar}>
						<div className={styles.gradientCircleTopLeft}></div>
						<div className={styles.gradientCircleBottomRight}></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Loose;