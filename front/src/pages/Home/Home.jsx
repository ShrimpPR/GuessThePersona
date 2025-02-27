/* eslint-disable react/no-unescaped-entities */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../helper/supabaseClient";
import Button from '@mui/material/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import "./Home.css";

function Home() {
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			// Récupérer l'utilisateur via la nouvelle méthode getUser()
			const { data: userData, error: userError } = await supabase.auth.getUser();
			if (userError) {
				console.error("Erreur récupération utilisateur :", userError.message);
				return;
			}

			const user = userData?.user;
			if (user) {
				// S'il y a un utilisateur connecté, on redirige vers /chatbox
				navigate("/guesschatbox");
				return;
			}
		};

		fetchUser();
	}, [navigate]);


	return (
		<div className="page-container">
			<link
				href="https://fonts.googleapis.com/css2?family=Anton&family=Garet&display=swap"
				rel="stylesheet"
			/>
			<div className="text-container">
				<img
					src="/LogoNoName.png"
					alt="Guess the persona Logo"
					className="home-logo"
				/>
				<p className="title-text">GUESS THE PERSONA</p>
				<p className="subtitle-text-one">
					L'HISTOIRE N'A JAMAIS ÉTÉ AUSSI AMUSANTE
				</p>
				<p className="subtitle-text-second">
					EXPLORE LE PASSÉ, POSE DES QUESTIONS ET DEVINE LES FIGURES
					HISTORIQUES QUI ONT MARQUÉ LE MONDE. PRÊT POUR LE DEFI ?
				</p>
				<div className="log-reg-buttons">
					<Button
						variant="outlined"
						href="/login"
						id="button"
						endIcon={
							<PlayCircleOutlineIcon style={{ fontSize: 40 }} />}
					>
						JOUER
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Home;
