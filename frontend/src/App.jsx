import { useState, useEffect } from "react";
import "./App.css";

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
				<h2>Calling /api/hello</h2>
				<p>{message}</p>
			</div>
		</>
	);
}

export default App;
