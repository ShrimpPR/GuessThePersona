import { useCallback, useState, useEffect } from "react";
import styles from "./GuessChatBox.module.css";
import { handleRequest } from "../../../components/utils/apiRequests";
import Menu from "../../../components/Menu/Menu";
import Validation from "../../../components/Validation/Validation";
import supabase from "../../../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const GuessChatBox = () => {
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [validationInput, setValidationInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [typingDots, setTypingDots] = useState("Typing");
	const [isBlurred, setIsBlurred] = useState(true);
	const [questions, setQuestions] = useState(0);

	useEffect(() => {
		if (!isTyping) return;

		let dotCount = 0;
		const interval = setInterval(() => {
			dotCount = (dotCount + 1) % 4;
			setTypingDots(`Typing${".".repeat(dotCount)}`);
		}, 250);

		return () => clearInterval(interval);
	}, [isTyping]);

	const decrementQuestions = async () => {
		if (questions <= 0) {
			console.log("Aucune question disponible.");
			return;
		}

		const newQuestionCount = questions - 1;

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
			.update({ questions: newQuestionCount })
			.eq("user_id", user.id);

		if (error) {
			console.error("Erreur en mettant à jour les questions :", error.message);
			return;
		}

		setQuestions(newQuestionCount);
		console.log("Questions mises à jour avec succès !");
	};

	const fetchUserData = useCallback(async () => {
		const { data } = await supabase.auth.getUser();

		const user = data?.user;
		if (!user) {
			navigate("/login");
			return;
		}
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("is_guessed, questions, guesses")
				.eq("user_id", user.id)
				.single();

			if (error) {
				console.error("Error fetching user data:", error);
				return null;
			}

			return data;
		} catch (err) {
			console.error("Unexpected error:", err);
			return null;
		}
	}, [navigate]);

	useEffect(() => {
		fetchUserData().then((data) => {
			if (data) {
				setQuestions(data.questions);
			}
		});
	}, [fetchUserData]);

	const handleSubmitQuestion = () => {
		if (questions <= 0) return;

		decrementQuestions();

		handleRequest({ type: "message", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred });
	};

	const handleRedirect = (url) => {
		window.location.href = url;
	};

	return (
		<div className={styles.GuessContainer}>
			<Menu handleRedirect={handleRedirect} />

			<div className={styles.GuessChatContainer}>
				<div className={styles.GuesschatBoxTitle}>
					DEVINE
					<p style={{ color: "#de97ff" }}>
						QUI JE SUIS
					</p>
				</div>
				<div className={styles.messagesContainer}>
					{messages.map((msg, index) => (
						<div key={index} className={`${styles.message} ${msg.sender === "user" ? styles.userMessage : styles.aiMessage}`}>
							{msg.text}
						</div>
					))}
					{isTyping && <div className={styles.typingIndicator}>{typingDots}</div>}
				</div>

				<div className={styles.inputContainer}>
					<input
						className={styles.inputField}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Pose ta question !"
						onKeyUp={(e) => e.key === "Enter" && handleSubmitQuestion()}
						disabled={questions <= 0}
					/>
					<button
						className={styles.sendButton}
						onClick={handleSubmitQuestion}
						disabled={questions <= 0}
					>
						<img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem" }} />
					</button>
				</div>
			</div>

			<Validation
				validationInput={validationInput}
				setValidationInput={setValidationInput}
				handleRequest={(data) => handleRequest({ ...data, input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}
				isBlurred={isBlurred}
			/>
		</div>
	);
};

export default GuessChatBox;
