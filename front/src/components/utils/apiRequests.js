import supabase from "../../helper/supabaseClient";

export const handleRequest = async ({
	type,
	input,
	validationInput,
	setMessages,
	setInput,
	setValidationInput,
	setIsTyping,
	setIsBlurred,
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
		const response = await fetch(`https://1591-2a01-e0a-208-bfa0-b5f4-c0bf-525-e67c.ngrok-free.app/api/${endpoint}`, {
			method: "POST",
			headers: {
				"Content-Type": "text/plain",
				"x-api-key": "testapikey",
				"x-user-id": userId,
			},
			body: JSON.stringify({
				model: "actual-model-guess",
				prompt: inputText,
				stream: false,
			}),
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
