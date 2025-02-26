import { useState, useEffect } from "react";
import supabase from "../../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "./Login.css";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				// Récupérer l'utilisateur via la nouvelle méthode getUser()
				const { data: userData, error: userError } = await supabase.auth.getUser();
				const user = userData?.user;
				if (user) {
					// S'il y a un utilisateur, on redirige vers /dashboard
					navigate("/guesschatbox");
					return;
				}
				if (userError) {
					console.error("Erreur lors de la récupération de l'utilisateur :", userError.message);
				}
			} catch (error) {
				console.error("Erreur inconnue lors de la récupération de l'utilisateur :", error.message);
			}
		};

		fetchUser();
	}, [navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage("");

		// Connexion de l'utilisateur
		const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (signInError) {
			setMessage(signInError.message);
			setEmail("");
			setPassword("");
			return;
		}

		if (signInData?.user) {
			const userId = signInData.user.id;

			try {
				// Vérifier si l'utilisateur a déjà un profil
				const { data: profileData, error: profileError } = await supabase
					.from("profiles")
					.select("user_id") // Récupérer uniquement l'ID pour minimiser les données
					.eq("user_id", userId)
					.single();

				if (profileError) {
					throw profileError;
				}

				if (!profileData) {
					// Si aucun profil n'existe, en créer un
					const { error: insertError } = await supabase
						.from("profiles")
						.insert([
							{
								user_id: userId,
								username: email.split("@")[0], // Exemple de pseudo par défaut
								coins: 100, // Valeur initiale
							},
						]);

					if (insertError) {
						console.error("Erreur lors de la création du profil :", insertError.message);
						setMessage("Logged in, but failed to create profile.");
					}
				}
			} catch (error) {
				console.error("Erreur lors de la gestion du profil :", error.message);
				setMessage("Logged in, but failed to manage profile.");
			}

			// Redirection vers le tableau de bord après connexion
			navigate("/guesschatbox");
		}
	};

	return (
		<div className="main-container">
			<link
				href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
				rel="stylesheet"
			/>
			<div className="container">
				<img
					src="/LogoNoName.png"
					alt="Guess the persona Logo"
					className="login-logo"
				/>
				<img
					src="/NoLogo.png"
					alt="Guess the persona"
					className="login-title"
				/>
			</div>
			<br />
			{message && <span>{message}</span>}
			<div className="account-box">
				<h2>Connexion Utilisateur</h2>
				<form onSubmit={handleSubmit}>
					<div className="login-entries">
						<TextField
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							id="outlined-basic"
							label="Email"
							variant="outlined"
							type="email"
							required
							sx={{
								background: "white",
								borderRadius: "5px",
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: 'white', // Set the outline color to white
									},
									'&:hover fieldset': {
										borderColor: 'white', // Set the outline color to white on hover
									},
									'&.Mui-focused fieldset': {
										borderColor: 'white', // Set the outline color to white when focused
									},
								},
							}}
						/>
						<TextField
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							id="outlined-password-input"
							label="Password"
							type="password"
							autoComplete="current-password"
							required
							sx={{
								background: "white",
								borderRadius: "5px",
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: 'white', // Set the outline color to white
									},
									'&:hover fieldset': {
										borderColor: 'white', // Set the outline color to white on hover
									},
									'&.Mui-focused fieldset': {
										borderColor: 'white', // Set the outline color to white when focused
									},
								},
							}}
						/>
					</div>
					<p className="forgottenpwd">Mot de passe oublié ?</p>
					<div className="login-buttons">
						<Button
							className="login"
							variant="outlined"
							type="submit"
							id="button"
						>
							Connexion
						</Button>
					</div>
					<div className="login-gotoregister">
						<span>Pas de compte ?</span>
						<Link to="/register" id="register-txt">Inscription</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
