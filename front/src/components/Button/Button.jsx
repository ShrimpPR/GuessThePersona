import React from "react";
import styles from "./Button.module.css";

const Button = ({ img, title, onClick }) => {
  return (
    <div
      className={styles.buttonItem}
      onClick={onClick}
    >
      {img && <img src={img} alt={title} className={styles.buttonIcon} />}
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default Button;
