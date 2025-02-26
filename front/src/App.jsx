import { BrowserRouter, Routes, Route } from "react-router-dom";
import DiscussChatBox from "./pages/ChatBox/discuss/DiscussChatBox";
import GuessChatBox from "./pages/ChatBox/Guess/GuessChatBox";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Loose from "./pages/Loose/Loose";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* home */}
				<Route path="/" element={<Home />} />

				{/* register */}
				<Route path="/register" element={<Register />} />

				{/* login */}
				<Route path="/login" element={<Login />} />

				{/* chatbox */}
				<Route path="/guesschatbox" element={<GuessChatBox />} />

				{/* discusschatbox */}
				<Route path="/discusschatbox" element={<DiscussChatBox />} />

				{/* loose */}
				<Route path="/loose" element={<Loose />} />

				{/* win */}
				<Route path="/win" />

			</Routes>
		</BrowserRouter>
	);
}

export default App;