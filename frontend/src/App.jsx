import { useState, useEffect } from "react";
import "./App.css";

import { css } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import TextField from "@mui/material/TextField";

function App() {
	const [message, setMessage] = useState("Message Loading...");

	useEffect(() => {
		fetch("/api/hello")
			.then((response) => response.json())
			.then((data) => setMessage(data.status))
			.catch((error) => console.error("Error fetching message:", error));
	}, []);

	return (
		<>
			<div className="card">
				<TextField id="firstName" label="First Name" variant="filled" />
				<p>{message}</p>
			</div>
		</>
	);
}

export default App;
