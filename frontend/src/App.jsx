import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar.jsx";
import SearchResults from "./components/SearchResults.jsx";
import PatientView from "./components/PatientView.jsx";

import { css } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function App() {
	const [isInSearhMode, setIsInSearchMode] = useState(true);
	const [searchQuery, setSearchQuery] = useState({});
	const [selectedData, setSelectedData] = useState(null);

	// SearchBar returns firstName, lastName, dob ... SearchResults does the fetch
	const handleSearch = (firstName, lastName, dob) => {
		setSearchQuery({ firstName: firstName, lastName: lastName, dob: dob });
		console.log("Search query set to:", { firstName, lastName, dob });
	};

	const handleResultClick = (data) => {
		window.scrollTo(0, 0);
		setSelectedData(data);
		setIsInSearchMode(false);
	};

	const onBack = () => {
		setIsInSearchMode(true);
	};

	return (
		<>
			<header className="appHeader">
				<h1>Patient Medication History Lookup</h1>
			</header>
			{isInSearhMode ? (
				<>
					<SearchBar onSearch={handleSearch} />
					<SearchResults query={searchQuery} onClick={handleResultClick} />
				</>
			) : (
				<PatientView data={selectedData} onBack={onBack} />
			)}
		</>
	);
}

export default App;
