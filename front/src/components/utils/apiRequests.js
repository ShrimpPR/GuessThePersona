import supabase from "../../helper/supabaseClient";

export const handleRequest = async ({
	type,
	input,
	validationInput,
	setMessages,
	setInput,
	setValidationInput,
	setIsTyping,
	setIsBlurred
}) => {
	const inputText = type === "message" ? input : validationInput;
	if (!inputText.trim()) return;

	if (type === "message") {
		const userMessage = { sender: "user", text: inputText };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsTyping(true);
	}

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) {
		console.error("Error fetching user:", userError.message);
		return;
	}

	const userId = userData?.user?.id;

	try {
		const endpoint = type === "message" ? "generate" : "validate";
		const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
				"x-api-key": "testapikey",
				"x-user-id": userId
			},
			body: JSON.stringify({
				model: "actual-model-guess",
				prompt: inputText,
				stream: false
			})
		});

		const data = await response.json();
		console.log(`${type === "message" ? "AI Response" : "Validation Response"}:`, data);

		if (type === "message") {
			const aiMessage = { sender: "ai", text: data.response || "No response received" };
			setMessages((prev) => [...prev, aiMessage]);
		} else if (type === "validate") {
			if (data.response === "Correct") {
				setIsBlurred(false);
			}
		}
	} catch (error) {
		if (type === "message") {
			setMessages((prev) => [...prev, { sender: "ai", text: "Error communicating with AI." }]);
		} else {
			console.error("Error sending validation request", error);
		}
	} finally {
		if (type === "message") {
			setIsTyping(false);
		} else {
			setValidationInput("");
		}
	}
};

export const handleDiscussRequest = async ({
	type,
	input,
	validationInput,
	setMessages,
	setInput,
	setValidationInput,
	setIsTyping,
	setIsBlurred
}) => {
	const inputText = type === "message" ? input : validationInput;
	if (!inputText.trim()) return;

	if (type === "message") {
		const userMessage = { sender: "user", text: inputText };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsTyping(true);
	}

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) {
		console.error("Error fetching user:", userError.message);
		return;
	}

	const userId = userData?.user?.id;

	if (type === "creationmodel") {
		handleNameRequest({
			input: inputText,
			setMessages,
			setInput
		});
		setInput("");
		// handleInageRefresh();
		return;
	}

	try {
		const endpoint = type === "message" ? "generate" : "validate";
		const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
				"x-api-key": "testapikey",
				"x-user-id": userId
			},
			body: JSON.stringify({
				model: userId,
				prompt: inputText,
				stream: false
			})
		});

		const data = await response.json();
		console.log(`${type === "message" ? "AI Response" : "Validation Response"}:`, data);

		if (type === "message") {
			const aiMessage = { sender: "ai", text: data.response || "No response received" };
			setMessages((prev) => [...prev, aiMessage]);
		} else if (type === "validate") {
			if (data.response === "Correct") {
				setIsBlurred(false);
			}
		}
	} catch (error) {
		if (type === "message") {
			setMessages((prev) => [...prev, { sender: "ai", text: "Error communicating with AI." }]);
		} else {
			console.error("Error sending validation request", error);
		}
	} finally {
		if (type === "message") {
			setIsTyping(false);
		} else {
			setValidationInput("");
		}
	}
};

const handleNameRequest = async ({
	input,
	setMessages,
	setInput
}) => {
	const inputText = input;
	if (!inputText.trim()) return;
	setInput("");

	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) {
		console.error("Error fetching user:", userError.message);
		return;
	}

	const userId = userData?.user?.id;

	try {
		const response = await fetch(`${import.meta.env.VITE_NGROK_LINK}api/createmodel`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": "testapikey",
				"x-user-id": userId
			},
			body: JSON.stringify({
				name: inputText
			})
		});

		const data = await response.json();
		console.log("Name Request Response:", data);
		window.location.reload();
	} catch (error) {
		setMessages((prev) => [...prev, { sender: "ai", text: "Error communicating with AI." }]);
		console.error("Error sending name request", error);
	}
};