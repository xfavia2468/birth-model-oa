import { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";

function SearchResults({ query, onClick }) {
	const [results, setResults] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [totalResults, setTotalResults] = useState(0);

	const PAGE_SIZE = 20;

	const fetchResults = async (pageNum = 1, reset = false) => {
		try {
			const params = new URLSearchParams();
			params.append("page", pageNum);

			if (query.firstName) params.append("firstName", query.firstName);
			if (query.lastName) params.append("lastName", query.lastName);
			if (query.dob) params.append("dob", query.dob);

			const response = await fetch(`/api/patients?${params.toString()}`);
			const data = await response.json();
			setResults((prev) => (reset ? data.results : [...prev, ...data.results]));

			setHasMore(data.results.length === PAGE_SIZE);
			setTotalResults(data.count);
			console.log("Search results:", data);
		} catch (error) {
			console.error("Error fetching search results:", error);
		}
	};

	useEffect(() => {
		setPage(1);
		fetchResults(1, true);
	}, [query]);

	const loadMorePatients = async () => {
		if (!hasMore) return;
		const nextPage = page + 1;
		setPage(nextPage);
		fetchResults(nextPage);
	};

	if (results === null) {
		return (
			<p style={{ textAlign: "center", marginTop: "2em" }}>
				Error fetching results.
			</p>
		);
	}

	if (!results || results.length === 0) {
		return (
			<p style={{ textAlign: "center", marginTop: "2em" }}>No results found.</p>
		);
	}

	return (
		<Box
			sx={{
				maxWidth: 800,
				margin: "2rem auto",
				p: 2,
			}}
		>
			<p style={{ textAlign: "left" }}> {totalResults} patients found.</p>
			<Stack spacing={2}>
				{results.map((patient) => (
					<Paper
						key={patient.id}
						elevation={1}
						sx={{
							p: 2,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Box>
							<Typography variant="subtitle1" fontWeight="bold">
								{patient.first_name} {patient.last_name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								DOB: {patient.date_of_birth}
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary">
							# of Medications:{" "}
							{patient.medications ? patient.medications.length : 0}
						</Typography>
						<Button
							variant="contained"
							color="primary"
							onClick={() => onClick(patient)}
						>
							Select
						</Button>
					</Paper>
				))}
			</Stack>
			{hasMore && (
				<Button
					variant="outlined"
					fullWidth
					sx={{ mt: 2 }}
					onClick={loadMorePatients}
				>
					Load More
				</Button>
			)}
		</Box>
	);
}

export default SearchResults;
