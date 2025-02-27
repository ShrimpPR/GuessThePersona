/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import supabase from "../../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import "./Register.css";

function Register() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

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
				// S'il y a un utilisateur, on redirige vers /guesschatbox
				navigate("/guesschatbox");
				return;
			}
		};

		fetchUser();
	}, [navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setMessage("");

		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password
		});

		if (error) {
			setMessage(error.message);
			return;
		}

		if (data) {
			setMessage("User account created!");
		}

		setEmail("");
		setPassword("");
		setConfirmPassword("");
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
			<div className="account-box">
				<h2>Création de compte</h2>
				<form onSubmit={handleSubmit}>

					<div className="account-entries">

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
										borderColor: 'white'
									},
									'&:hover fieldset': {
										borderColor: 'white'
									},
									'&.Mui-focused fieldset': {
										borderColor: 'white'
									}
								}
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
										borderColor: 'white'
									},
									'&:hover fieldset': {
										borderColor: 'white'
									},
									'&.Mui-focused fieldset': {
										borderColor: 'white'
									}
								}
							}}
						/>

						<TextField
							onChange={(e) => setConfirmPassword(e.target.value)}
							value={confirmPassword}
							id="outlined-password-input"
							label="Confirm Password"
							type="password"
							autoComplete="current-password"
							required
							sx={{
								background: "white",
								borderRadius: "5px",
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: 'white'
									},
									'&:hover fieldset': {
										borderColor: 'white'
									},
									'&.Mui-focused fieldset': {
										borderColor: 'white'
									}
								}
							}}
						/>

					</div>

					<div className="register-msg">
						{message && <span>{message}</span>}
					</div>

					<div className="account-buttons">
						<Button
							variant="outlined"
							type="submit"
							id="button"
						>
							S'inscrire
						</Button>
					</div>
					<div className="account-gotoregister">
						<span>Déjà un compte ?</span>
						<Link to="/login" id="login-txt">Connexion</Link>

					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
