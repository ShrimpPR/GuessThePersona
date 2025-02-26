import { useState, useEffect } from "react";
import styles from "./ChatBox.module.css";
import { handleRequest } from "../../components/utils/apiRequests";
import Button from "../../components/Button/Button";

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
      <div className={styles.menuContainer}>
        <img src="/Logo.png" alt="Guess the persona Logo" className={styles.logoImage} />
        <div className={styles.menuItemsContainer}>
          <Button img="/Icons/houseIcon.svg" title="Accueil" onClick={() => handleRedirect("/dashboard")}/>
          <Button img="/Icons/cupIcon.svg" title="Récompenses" />
          <Button img="/Icons/instaIcon.svg" title="Suis-nous !" onClick={() => handleRedirect("https://www.instagram.com")} />
        </div>
        <div className={styles.menuItem}>Contact(temp)</div>
      </div>

      <div className={styles.chatBoxContainer}>
        <div className={styles.chatContainer}>
          <div className={styles.chatBoxTitle}>DEVINE <p style={{ color: "#de97ff"}}>QUI JE SUIS</p></div>
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
              <img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem"}}/>
            </button>
          </div>
        </div>

        <div className={styles.validationContainer}>
          <img src="/circleBlur.svg" alt="" className={styles.validationCircle} />
          <img src="https://picsum.photos/seed/picsum/450/450" alt="" className={`${styles.validationImage} ${isBlurred ? styles.blurred : ""}`} />
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <input
              className={styles.validationField}
              value={validationInput}
              onChange={(e) => setValidationInput(e.target.value)}
              placeholder="Trouve son nom !"
              onKeyUp={(e) => e.key === "Enter" && handleRequest({ type: "validate", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}
            />
            <button className={styles.validationButton} onClick={() => handleRequest({ type: "validate", input, validationInput, setMessages, setInput, setValidationInput, setIsTyping, setIsBlurred })}>
              <img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem"}}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
