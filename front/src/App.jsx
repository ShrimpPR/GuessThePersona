import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Register from "./pages/Login/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Wrapper from "./pages/Login/Wrapper";
import ChatBox from "./pages/ChatBox/ChatBox";

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
				<Route path="/chatbox" element={<ChatBox />} />

				{/* dashboard */}
				<Route
					path="/dashboard"
					element={
						<Wrapper>
							<Dashboard />
						</Wrapper>
					}
				/>

			</Routes>
		</BrowserRouter>
	);
}

export default App;