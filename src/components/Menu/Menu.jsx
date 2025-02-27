import styles from "./Menu.module.css";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import supabase from "../../helper/supabaseClient";
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from "@mui/material/Typography";

const Menu = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error("Erreur lors de la déconnexion :", error.message);
			return;
		}
		console.log("Utilisateur déconnecté");
		navigate("/");
	};

	return (
		<div className={styles.menuContainer}>
			<img src="/Logo.png" alt="Guess the persona Logo" className={styles.logoImage} />
			<div className={styles.menuItemsContainer}>
				<Button img="/Icons/houseIcon.svg" title="Accueil" onClick={() => navigate("/")} />
				<Button img="/Icons/cupIcon.svg" title="Récompenses" />
				<Button img="/Icons/instaIcon.svg" title="Suis-nous !" onClick={() => window.open("https://www.instagram.com", "_blank")} />
				<Button img="/Icons/questionIcon.svg" title="Besoin d'aide ?" />
				<Button img="/Icons/chatIcon.svg" title="Trouve-moi" onClick={() => navigate("/guesschatbox")} />
				<Button img="/Icons/chatIcon.svg" title="Parle-moi" onClick={() => navigate("/discusschatbox")} />
			</div>
			<div className={styles.menuItem} onClick={handleLogout}>
				<LogoutIcon sx={{ margin: "3px" }} />
				<Typography variant="body2" sx={{ color: 'white', marginLeft: '5px' }}>
					Déconnexion
				</Typography>
			</div>
		</div>
	);
};

export default Menu;
