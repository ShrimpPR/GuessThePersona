import styles from "./Validation.module.css";

const Validation = ({ validationInput, setValidationInput, handleRequest, isBlurred }) => {
  return (
    <div className={styles.validationContainer}>
      <img src="/circleBlur.svg" alt="" className={styles.validationCircle} />
      <img
        src="https://picsum.photos/seed/picsum/450/450"
        alt=""
        className={`${styles.validationImage} ${isBlurred ? styles.blurred : ""}`}
      />
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <input
          className={styles.validationField}
          value={validationInput}
          onChange={(e) => setValidationInput(e.target.value)}
          placeholder="Trouve son nom !"
          onKeyUp={(e) => e.key === "Enter" && handleRequest({ type: "validate" })}
        />
        <button
          className={styles.validationButton}
          onClick={() => handleRequest({ type: "validate" })}
        >
          <img src="/Icons/rightArrowIcon.svg" alt="Send" style={{ width: "2rem" }} />
        </button>
      </div>
    </div>
  );
};

export default Validation;
