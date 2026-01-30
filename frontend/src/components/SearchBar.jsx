import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function SearchBar({ onSearch }) {
	return (
		<>
			<Box
				className="searchBox"
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 2,
					width: "70%",
					margin: "0 auto",
					marginTop: "2em",
					justifyContent: "center",
				}}
			>
				<TextField id="firstName" label="First Name" variant="filled" />
				<TextField id="lastName" label="Last Name" variant="filled" />
				<Button
					id="searchButton"
					variant="contained"
					sx={{ minWidth: "100px" }}
				>
					Search
				</Button>
			</Box>
		</>
	);
}

export default SearchBar;
