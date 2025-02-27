/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styles from "./MakeModel.module.css";
import supabase from "../../helper/supabaseClient";

const MakeModel = ({ validationInput, setValidationInput, handleDiscussRequest }) => {
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		const fetchImage = async () => {
			const { data: userData, error: userError } = await supabase.auth.getUser();

			if (userError) {
				console.error("Error fetching user:", userError.message);
				return;
			}

			const userId = userData?.user?.id;
			try {
				const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/getimageperso`, {
					method: "GET",
					headers: {
						"x-api-key": "testapikey",
						"x-user-id": userId,
						"ngrok-skip-browser-warning": "69420",
					}
				});

				const text = await response.text();
				console.log("Raw response text:", text);

				const data = JSON.parse(text);
				console.log("Image data:", data);

				if (data.url) {
					processImage(data.url);
				} else {
					throw new Error("Invalid image URL");
				}
			} catch (error) {
				console.error("Error fetching image:", error);
				setImageUrl("https://st3.depositphotos.com/8440746/32989/v/450/depositphotos_329897202-stock-illustration-support-icon-vector-question-mark.jpg");
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

		fetchImage();
	}, []);

	return (
		<div className={styles.validationContainer}>
			<img
				src={imageUrl}
				alt="Fetched validation"
				className={`${styles.validationImage}`}
			/>
			<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<input
					className={styles.validationField}
					value={validationInput}
					onChange={(e) => setValidationInput(e.target.value)}
					placeholder="Choisis ton personnage !"
					onKeyUp={(e) => e.key === "Enter" && handleDiscussRequest({ type: "creationmodel" })}
				/>
				<button
					className={styles.validationButton}
					onClick={() => handleDiscussRequest({ type: "creationmodel" })}
				>
					<img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem" }} />
				</button>
			</div>
		</div>
	);
};

export default MakeModel;
