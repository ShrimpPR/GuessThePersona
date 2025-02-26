import { useState, useEffect } from "react";
import styles from "./ChatBox.module.css";
import { handleRequest } from "../../components/utils/apiRequests";
import Menu from "../../components/Menu/Menu";
import Validation from "../../components/Validation/Validation";
import supabase from "../../helper/supabaseClient";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [validationInput, setValidationInput] = useState("");
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

  const handleRedirect = (url) => {
    window.location.href = url;
  };

  return (
    <div className={styles.container}>
      <Menu handleRedirect={handleRedirect} />

      <div className={styles.chatContainer}>
        <div className={styles.chatBoxTitle}>DEVINE <p style={{ color: "#de97ff" }}>QUI JE SUIS</p></div>
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
            onKeyUp={(e) => e.key === "Enter" && handleRequest({ type: "message", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}
          />
          <button className={styles.sendButton} onClick={() => handleRequest({ type: "message", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}>
            <img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem" }} />
          </button>
        </div>
      </div>

      <div className={styles.separator}></div>

      <Validation
        validationInput={validationInput}
        setValidationInput={setValidationInput}
        handleRequest={(data) => handleRequest({ ...data, input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}
        isBlurred={isBlurred}
      />
    </div>
  );
};

export default ChatBox;
