import styles from "./Menu.module.css";
import Button from "../Button/Button";

const Menu = ({ handleRedirect }) => {
  return (
    <div className={styles.menuContainer}>
      <img src="/Logo.png" alt="Guess the persona Logo" className={styles.logoImage} />
      <div className={styles.menuItemsContainer}>
        <Button img="/Icons/houseIcon.svg" title="Accueil" onClick={() => handleRedirect("/dashboard")} />
        <Button img="/Icons/cupIcon.svg" title="Récompenses" />
        <Button img="/Icons/instaIcon.svg" title="Suis-nous !" onClick={() => handleRedirect("https://www.instagram.com")} />
      </div>
      <div className={styles.menuItem}>Contact(temp)</div>
    </div>
  );
};

export default Menu;
