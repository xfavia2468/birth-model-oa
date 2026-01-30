import {
	Timeline,
	TimelineItem,
	TimelineSeparator,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
} from "@mui/lab";
import { Box, Typography, Chip } from "@mui/material";

const formatDate = (date) => {
	if (!date) return "Unknown";
	const d = new Date(date);
	return isNaN(d) ? "Unknown" : d.toISOString().split("T")[0];
};

const normalizeEndDate = (endDate) =>
	endDate ? new Date(endDate) : new Date();

const detectConflicts = (medications, patientBirthDate) => {
	const enriched = medications.map((m) => ({
		...m,
		hasConflict: false,
		conflictTypes: [],
		changes: [],
	}));

	const birthDate = patientBirthDate ? new Date(patientBirthDate) : null;

	// Group meds by name (case-insensitive)
	const groups = {};
	enriched.forEach((med) => {
		const key = med?.name?.toLowerCase() || "unknown";
		groups[key] ??= [];
		groups[key].push(med);
	});

	Object.values(groups).forEach((group) => {
		// Sort meds by start date ascending
		group.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

		for (let i = 0; i < group.length; i++) {
			const med = group[i];
			const medStart = new Date(med.start_date);
			const medEnd = normalizeEndDate(med.end_date);

			// Impossible start date
			if (birthDate && !isNaN(medStart) && medStart < birthDate) {
				med.hasConflict = true;
				if (!med.conflictTypes.includes("Impossible Start Date"))
					med.conflictTypes.push("Impossible Start Date");
			}

			for (let j = i + 1; j < group.length; j++) {
				const nextMed = group[j];
				const nextStart = new Date(nextMed.start_date);
				const nextEnd = normalizeEndDate(nextMed.end_date);

				// Check overlap for conflicts
				const overlap =
					medStart <= nextEnd &&
					nextStart <= medEnd &&
					!isNaN(medStart) &&
					!isNaN(medEnd) &&
					!isNaN(nextStart) &&
					!isNaN(nextEnd);

				if (overlap) {
					// Conflicts only if overlapping
					[
						["Dose", "dose_amount", "dose_measurement"],
						["Route", "route"],
						["Prescriber", "prescribing_facility"],
					].forEach(([label, field1, field2]) => {
						const aVal = field2 ? med[field1] + med[field2] : med[field1] || "";
						const bVal = field2
							? nextMed[field1] + nextMed[field2]
							: nextMed[field1] || "";
						if (aVal !== bVal) {
							med.hasConflict = true;
							nextMed.hasConflict = true;
							if (!med.conflictTypes.includes(`${label} Mismatch`))
								med.conflictTypes.push(`${label} Mismatch`);
							if (!nextMed.conflictTypes.includes(`${label} Mismatch`))
								nextMed.conflictTypes.push(`${label} Mismatch`);
						}
					});
					// Date overlap
					med.hasConflict = true;
					nextMed.hasConflict = true;
					if (!med.conflictTypes.includes("Date Overlap"))
						med.conflictTypes.push("Date Overlap");
					if (!nextMed.conflictTypes.includes("Date Overlap"))
						nextMed.conflictTypes.push("Date Overlap");
				} else {
					// NON-overlapping sequential changes (only forward med gets change)
					[
						["Dose", "dose_amount", "dose_measurement"],
						["Route", "route"],
						["Prescriber", "prescribing_facility"],
					].forEach(([label, field1, field2]) => {
						const prevVal = field2
							? med[field1] + med[field2]
							: med[field1] || "";
						const currVal = field2
							? nextMed[field1] + nextMed[field2]
							: nextMed[field1] || "";
						if (
							prevVal !== currVal &&
							!nextMed.changes.includes(`${label} Changed`)
						) {
							nextMed.changes.push(`${label} Changed`);
						}
					});
				}
			}
		}
	});

	return enriched;
};

function MedicationTimeline({ medications, patientBirthDate }) {
	if (!Array.isArray(medications) || medications.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				No medication history available.
			</Typography>
		);
	}

	const enriched = detectConflicts(medications, patientBirthDate);

	// Sort medications by end date (most recent first), treating ongoing meds as most recent
	const sorted = enriched.sort((a, b) => {
		const aDate = new Date(a?.end_date || Date.now());
		const bDate = new Date(b?.end_date || Date.now());
		return bDate - aDate;
	});

	return (
		<Timeline position="right">
			{sorted.map((med, index) => {
				const name = med?.name?.trim() || "Unnamed medication";

				const dose =
					med?.dose_amount && med?.dose_measurement
						? `${med.dose_amount}${med.dose_measurement}`
						: "Dose unknown";

				const doseAmount = med?.dose_amount || "??";
				const doseMeasurement = med?.dose_measurement || "--";

				const route = med?.route || "Route unknown";
				const facility = med?.prescribing_facility || "Unknown facility";

				const start = formatDate(med?.start_date);
				const end = formatDate(med?.end_date);

				const isCurrent = !med?.end_date || new Date(med.end_date) > new Date();

				return (
					<TimelineItem key={med?.id ?? index}>
						<TimelineSeparator>
							<TimelineDot
								color={
									med.hasConflict ? "error" : isCurrent ? "success" : "grey"
								}
							/>
							{index < sorted.length - 1 && <TimelineConnector />}
						</TimelineSeparator>

						<TimelineContent>
							<Box
								sx={{
									mb: 2,
									p: 1,
									borderRadius: 1,
									backgroundColor: med.hasConflict
										? "rgba(211, 47, 47, 0.08)"
										: "transparent",
								}}
							>
								{/* Name + Status */}
								<Typography variant="subtitle1" fontWeight="bold">
									{name}

									{med.hasConflict && med.conflictTypes.length > 0 && (
										<Box sx={{ mt: 0.5 }}>
											{med.conflictTypes.map((type, idx) => (
												<Chip
													key={idx}
													label={type}
													size="small"
													color="error"
													sx={{ mr: 0.5, mb: 0.5 }}
												/>
											))}
										</Box>
									)}

									{!med.hasConflict && med.changes.length > 0 && (
										<Box sx={{ mt: 0.5 }}>
											{med.changes.map((change, idx) => (
												<Chip
													key={idx}
													label={change}
													size="small"
													sx={{
														mr: 0.5,
														mb: 0.5,
														backgroundColor: "rgba(0, 123, 255, 0.15)",
														color: "#007bff",
													}}
												/>
											))}
										</Box>
									)}

									{!med.hasConflict && isCurrent && (
										<Chip
											label="Current"
											size="small"
											color="success"
											sx={{ ml: 1 }}
										/>
									)}
								</Typography>

								{/* Dates */}
								<Typography variant="body2" color="text.secondary">
									{start} — {end || "Present"}
								</Typography>

								{/* Dose / Route */}
								<Typography variant="body2">
									{med.dose_amount && med.dose_measurement
										? `${doseAmount} ${doseMeasurement}`
										: "Dose unknown"}{" "}
									• {route}
								</Typography>

								{/* Facility */}
								<Typography variant="body2" color="text.secondary">
									Prescribed by: {facility}
								</Typography>
							</Box>
						</TimelineContent>
					</TimelineItem>
				);
			})}
		</Timeline>
	);
}

export default MedicationTimeline;
