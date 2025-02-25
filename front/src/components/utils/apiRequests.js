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
  
    try {
      const endpoint = type === "message" ? "generate" : "validate";
      const response = await fetch(`https://d10a-209-206-8-34.ngrok-free.app/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "x-api-key": "testapikey",
        },
        body: JSON.stringify({
          model: "actual-model",
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
  