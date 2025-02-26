/* eslint-disable react/no-unescaped-entities */
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
					navigate("/chatbox");
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
			navigate("/chatbox");
		}
	};

	return (
		<div>
			<link
				href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
				rel="stylesheet"
			/>
			<div className="heading">
				<table
					direction="row"
				>
					<tr>
						<td>
							<img
								src="/LogoNoName.png"
								alt="Guess the persona Logo"
								className="logo"
							/>
						</td>
						<td>
							<img
								src="/NoLogo.png"
								alt="Guess the persona"
								className="title"
							/>
						</td>
					</tr>
				</table>
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
							}}
						/>
					</div>
					<p className="forgottenpwd">Mot de passe oublié ?</p>
					<div className="login-buttons">
						<Button variant="outlined" type="submit" id="button">Login</Button>
					</div>
					<div className="login-gotoregister">
						<span>Pour créer un compte ?</span>
						<Link to="/register" id="register-txt">Cliquez-ici</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
