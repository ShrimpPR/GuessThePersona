import { useState, useEffect } from "react";
import styles from "./ChatBox.module.css";
import { handleRequest } from "../../components/utils/apiRequests";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [validationInput, setValidationInput] = useState("");
  // const [username, setUsername] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState("Typing");
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    let dotCount = 0;
    const interval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setTypingDots(`Typing${".".repeat(dotCount)}`);
    }, 250);

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <div className={styles.chatContainer}>
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
          placeholder="Ask a question..."
          onKeyUp={(e) => e.key === "Enter" && handleRequest({ type: "message", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}
        />
        <button className={styles.sendButton} onClick={() => handleRequest({ type: "message", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}>
          Send
        </button>
      </div>

      <div className={styles.validationContainer}>
        <img
          src="https://picsum.photos/seed/picsum/450/450"
          alt=""
          className={`${styles.validationImage} ${isBlurred ? styles.blurred : ""}`}
        />
        <input
          className={styles.validationField}
          value={validationInput}
          onChange={(e) => setValidationInput(e.target.value)}
          placeholder="Enter validation request..."
          onKeyUp={(e) => e.key === "Enter" && handleRequest({ type: "validate", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}
        />
        <button className={styles.validationButton} onClick={() => handleRequest({ type: "validate", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}>
          Validate
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
