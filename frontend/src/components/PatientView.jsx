import { Button, Typography, Box } from "@mui/material";
import MedicationTimeline from "./MedicationTimeline.jsx";

function PatientView({ data, onBack }) {
	return (
		<>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 2,
					margin: "0 auto",
					marginTop: "2em",
				}}
			>
				<Box sx={{ flex: 2 }}>
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
				</Box>
				<Box
					sx={{
						flex: 3,
						borderLeft: "1px solid #ccc",
						justifyContent: "flex-start",
						alignItems: "flex-start",
						paddingLeft: "1em",
					}}
				>
					<MedicationTimeline
						medications={data.medications}
						patientBirthDate={data.date_of_birth}
					/>
				</Box>
			</Box>
		</>
	);
}

export default PatientView;
