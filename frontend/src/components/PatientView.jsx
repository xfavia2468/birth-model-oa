import { Button, Typography } from "@mui/material";

function PatientView({ data, onBack }) {
	return (
		<>
			<Button
				variant="contained"
				onClick={onBack}
				style={{ marginBottom: "1em" }}
			>
				&lt; Back to Search Results
			</Button>
			<Typography variant="h5" gutterBottom>
				Patient Details
			</Typography>
			<Typography variant="body1">
				<strong>First Name:</strong> {data.first_name}
			</Typography>
			<Typography variant="body1">
				<strong>Last Name:</strong> {data.last_name}
			</Typography>
			<Typography variant="body1">
				<strong>Date of Birth:</strong> {data.date_of_birth}
			</Typography>
		</>
	);
}

export default PatientView;
