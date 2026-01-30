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
					marginTop: "0em",
					justifyContent: "center",
				}}
			>
				<TextField id="firstName" label="First Name" variant="filled" />
				<TextField id="lastName" label="Last Name" variant="filled" />
				<TextField id="dob" label="Date of Birth" variant="filled" />
				<Button
					id="searchButton"
					variant="contained"
					sx={{ minWidth: "100px" }}
					onClick={() => {
						const firstName = document.getElementById("firstName").value.trim();
						const lastName = document.getElementById("lastName").value.trim();
						const dob = document.getElementById("dob").value.trim();
						onSearch(firstName, lastName, dob);
					}}
				>
					Search
				</Button>
			</Box>
		</>
	);
}

export default SearchBar;
