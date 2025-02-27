import { useState, useEffect } from "react";
import styles from "./DiscussChatBox.module.css";
import { handleRequest } from "../../../components/utils/apiRequests";
import Menu from "../../../components/Menu/Menu";
import Validation from "../../../components/Validation/Validation";
import supabase from "../../../helper/supabaseClient";
import { useNavigate } from "react-router-dom";

const DiscussChatBox = () => {
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [validationInput, setValidationInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [typingDots, setTypingDots] = useState("Typing");
	const [isBlurred, setIsBlurred] = useState(true);
	const [memory, setMemory] = useState(null);

	useEffect(() => {
		if (!isTyping) return;

		let dotCount = 0;
		const interval = setInterval(() => {
			dotCount = (dotCount + 1) % 4;
			setTypingDots(`Typing${".".repeat(dotCount)}`);
		}, 250);

		return () => clearInterval(interval);
	}, [isTyping]);

	const fetchMemory = async () => {
		try {
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
		  const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/getmemory`, {
			method: "POST",
			headers: {
			  "x-api-key": "testapikey",
			  "x-user-id": user.id,
			},
			body: JSON.stringify({ model: "guess" }),
		  });

		  if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		  }
		  console.log(userData?.user?.id);

		  const data = await response.json();
		  return data;
		} catch (error) {
		  console.error("Error fetching memory:", error);
		  return null;
		}
	  };

	  useEffect(() => {
		fetchMemory().then((data) => {
		  if (data && data.response) {
			console.log("Memory fetched:", data.response);

			const responseArray = Array.isArray(data.response) ? data.response : [data.response];

			const parsedMessages = responseArray.flatMap((entry) =>
			  entry.split("\n").map((line) => {
				if (line.startsWith("user:")) {
				  return { sender: "user", text: line.replace("user: ", "") };
				} else if (line.startsWith("ollama:")) {
				  return { sender: "ollama", text: line.replace("ollama: ", "") };
				}
				return null;
			  }).filter(Boolean)
			);

			setMemory(data);
			setMessages(parsedMessages);
		  }
		});
	  }, []);

	const fetchUserData = async () => {
		const { data } = await supabase.auth.getUser();
		const user = data?.user;

		if (!user) {
			navigate("/login");
			return;
		}

		try {
			const { error } = await supabase
				.from("profiles")
				.select("is_guessed, questions, guesses")
				.eq("user_id", user.id)
				.single();

			if (error) {
				console.error("Error fetching user data:", error);
				return null;
			}

		} catch (err) {
			console.error("Unexpected error:", err);
			return null;
		}
	};

	useEffect(() => {
		fetchUserData()
	});

	const handleSubmitQuestion = () => {
		handleRequest({ type: "message", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred });
	};

	const handleRedirect = (url) => {
		window.location.href = url;
	};

	return (
		<div className={styles.DiscussContainer}>
			<Menu handleRedirect={handleRedirect} />

			<div className={styles.DiscussChatContainer}>
				<div className={styles.DiscussChatBoxTitle}>
					ON PEUT
					<p style={{ color: "#de97ff" }}>
						DISCUTER
					</p>
					PEUT-ÊTRE ?
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
					/>
					<button
						className={styles.sendButton}
						onClick={handleSubmitQuestion}
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

export default DiscussChatBox;
