import { useState, useEffect } from "react";
import styles from "./Validation.module.css";
import supabase from "../../helper/supabaseClient";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Win from "../../pages/Win/Win";

const Validation = ({ validationInput, setValidationInput, handleRequest, isBlurred, setIsBlurred, guesses, setGuesses, isGuessed, setIsGuessed, showWinPopup, setShowWinPopup }) => {
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchImage = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/getimage`, {
					method: "GET",
					headers: {
						"x-api-key": "testapikey",
						"ngrok-skip-browser-warning": "69420",
					},
				});

				const text = await response.text();
				const data = JSON.parse(text);
				// console.log("Image data:", data);

				if (data.url) {
					processImage(data.url);
					setLoading(false);
				} else {
					throw new Error("Invalid image URL");
				}
			} catch (error) {
				console.error("Error fetching image:", error);
				setImageUrl("https://st3.depositphotos.com/8440746/32989/v/450/depositphotos_329897202-stock-illustration-support-icon-vector-question-mark.jpg");
				setLoading(false);
			}
		};

		const processImage = (url) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.src = url;

			img.onload = () => {
				let { naturalWidth: width, naturalHeight: height } = img;
				const targetSize = window.innerWidth < 1024 ? 340 : 450;

				const size = Math.min(width, height);
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext("2d");

				const offsetX = (width - size) / 2;
				const offsetY = (height - size) / 2;
				ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

				const finalCanvas = document.createElement("canvas");
				finalCanvas.width = targetSize;
				finalCanvas.height = targetSize;
				const finalCtx = finalCanvas.getContext("2d");

				finalCtx.drawImage(canvas, 0, 0, targetSize, targetSize);

				finalCanvas.toBlob((blob) => {
					const finalUrl = URL.createObjectURL(blob);
					setImageUrl(finalUrl);
				}, "image/jpeg");
			};
		};

		const checkGuessed = async () => {
			const { data: userData, error: userError } = await supabase.auth.getUser();
			if (userError) {
				console.error("Erreur récupération utilisateur :", userError.message);
				return;
			}

			const { data, error } = await supabase
				.from("profiles")
				.select("is_guessed")
				.eq("user_id", userData.user.id);

			if (error) {
				console.error("Erreur récupération du profil :", error.message);
				return;
			}
			if (data && data.length > 0 && data[0].is_guessed) {
				setIsBlurred(false);
				setShowWinPopup(true);
			}
		};

		fetchImage();
		checkGuessed();
	}, []);

	const decrementGuesses = async () => {
		if (guesses <= 0) {
			console.log("Aucune Guesses disponible.");
			return;
		}

		const newGuessesCount = guesses - 1;
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError) {
			console.error("Erreur récupération utilisateur :", userError.message);
			return;
		}

		const user = userData?.user;
		if (!user) {
			navigate("/login");
			return;
		}

		const { error } = await supabase
			.from("profiles")
			.update({ guesses: newGuessesCount })
			.eq("user_id", user.id);

		if (error) {
			console.error("Erreur en mettant à jour les guesses :", error.message);
			return;
		}

		setGuesses(newGuessesCount);
		console.log("Guesses mises à jour avec succès !");
	};

	const handleSubmitGuess = async () => {
		if (guesses <= 0) return;

		await decrementGuesses();
		const response = await handleRequest({ type: "validate" });

		if (response?.isCorrect) {
			setIsGuessed(true);
			setShowWinPopup(true);
		}
	};

    useEffect(() => {
        console.log("Win popup state changed:", showWinPopup);
    }, [showWinPopup]);

	return (
		<div className={styles.validationContainer}>
			{loading ? (
				<CircularProgress />
			) : (
				<>
					<img src="/circleBlur.svg" alt="frame" className={styles.validationCircle} />
					<img src={imageUrl} alt="Fetched validation" className={`${styles.validationImage} ${isBlurred ? styles.blurred : ""}`} />
				</>
			)}

			<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<input
					className={styles.validationField}
					value={validationInput}
					onChange={(e) => setValidationInput(e.target.value)}
					placeholder="Trouve son nom !"
					onKeyUp={(e) => e.key === "Enter" && handleSubmitGuess()}
					disabled={guesses <= 0}
				/>
				<button
					className={styles.validationButton}
					onClick={handleSubmitGuess}
					disabled={guesses <= 0}
				>
					<img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem" }} />
				</button>
			</div>
			<div className={styles.validationTries}>Vous avez encore {guesses} essais.</div>

            {<div className={`${styles.winPopup} ${isGuessed ? "" : styles.hidden}`}>
                <Win onClose={() => {
                    window.location.reload();
                    setIsGuessed(false);
                }} />
            </div>}


		</div>
	);
};

export default Validation;
