/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect } from "react";
import styles from "./Win.module.css";
import Menu from "../../components/Menu/Menu";
import supabase from "../../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const Win = () => {
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
		<div className={styles.WinContainer}>
			<Menu handleRedirect={handleRedirect} />
			<div className={styles.WinContent}>
				<h1 className={styles.title}>BRAVO !</h1>
				<div className={styles.messageContainer}>
					<div className={styles.speechBubble}>
						Tu mérites d'accéder à mes secrets bien guardés... Fais tourner la roue et régale-toi !
					</div>
				</div>
			</div>
		</div>
	);
};

export default Win;