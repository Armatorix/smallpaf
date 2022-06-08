import ImportExportIcon from "@mui/icons-material/ImportExport";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Select,
} from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { currentRoomState, userState, useToken } from "../store";
import { ENDPOINT } from "../config";

const POINTS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const stats = (votes) => {
	let total = 0;
	let min = votes[0]?.Points;
	let max = votes[0]?.Points;
	let votesGrouped = {};
	votes.forEach((el) => {
		if (votesGrouped[el.Points] === undefined) votesGrouped[el.Points] = 0;
		votesGrouped[el.Points] += 1;
		total += el.Points;
		if (el.Points > max) {
			max = el.Points;
		} else if (el.Points < min) {
			min = el.Points;
		}
	});
	let avg = (total / votes.length).toFixed(1);
	let closest = closestPoint(avg);
	return [min, max, avg, closest, votesGrouped];
};

const closestPoint = (value) => {
	let diff = POINTS.at(-1) + 1;
	for (let i = 0; i < POINTS.length; i++) {
		if (Math.abs(POINTS.at(i) - value) > diff) {
			return POINTS.at(i - 1);
		}
		diff = Math.abs(POINTS.at(i) - value);
	}
	return POINTS.at(-1);
};

const VotedModal = (props) => {
	const [min, max, avg, closest, votesGrouped] = stats(props.votes);
	const [open, setOpen] = useState(false);
	const [token] = useToken();
	const resetUser = useResetRecoilState(userState);
	const resetRoom = useResetRecoilState(currentRoomState);
	const [pickerValue, setPickerValue] = useState(closest);

	return (
		<>
			<Button
				{...props}
				variant="contained"
				onClick={() => setOpen(true)}
				color={Math.abs((avg - min) * (avg - max)) > 2 ? "warning" : "success"}
			>
				AVG: {avg} MIN: {min} MAX: {max}
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle justifyContent="center">Vote results</DialogTitle>
				<DialogContent>
					{Object.keys(votesGrouped).map((point) => (
						<>
							{votesGrouped[point]}x{" "}
							<Button variant="contained">{point}</Button>
						</>
					))}
				</DialogContent>
				<DialogActions>
					{props.showJiraApply && (
						<>
							<Button
								variant="contained"
								fullWidth
								onClick={(e) => {
									e.preventDefault();
									fetch(
										`${ENDPOINT}/api/v1/rooms/${props.roomid}/tickets/${props.ticketid}/jira-apply`,
										{
											cache: "no-cache",
											body: JSON.stringify({
												value: pickerValue,
											}),
											headers: {
												"content-type": "application/json",
												authorization: `Bearer ${token}`,
											},
											method: "POST",
											mode: "cors",
										}
									)
										.then((resp) => {
											if (resp.status >= 300) {
												throw Error("failed creation");
											}
										})
										.then(() => {
											resetRoom();
											resetUser();
											setOpen(false);
										})
										.catch((err) => {
											console.log(err);
										});
								}}
								startIcon={<ImportExportIcon />}
								color="success"
							>
								JIRA Apply
							</Button>
							<Select
								labelId="jira-estimate-value"
								id="jira-estimate-value-select"
								value={pickerValue}
								onChange={(v) => {
									setPickerValue(v.target.value);
								}}
							>
								{POINTS.map((point) => (
									<MenuItem value={point}>{point}</MenuItem>
								))}
							</Select>
						</>
					)}
					<Button
						variant="contained"
						fullWidth
						onClick={(e) => {
							e.preventDefault();
							fetch(
								`${ENDPOINT}/api/v1/rooms/${props.roomid}/tickets/${props.ticketid}/reset`,
								{
									cache: "no-cache",
									headers: {
										"content-type": "application/json",
										authorization: `Bearer ${token}`,
									},
									method: "POST",
									mode: "cors",
								}
							)
								.then((resp) => {
									if (resp.status >= 300) {
										throw Error("failed creation");
									}
								})
								.then(() => {
									resetRoom();
									resetUser();
									setOpen(false);
								})
								.catch((err) => {
									console.log(err);
								});
						}}
						startIcon={<RestartAltIcon />}
						color="error"
					>
						Reset
					</Button>
					<Button
						variant="outlined"
						fullWidth
						onClick={() => {
							setOpen(false);
						}}
						color="error"
						startIcon={<CancelIcon />}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

VotedModal.defaultProps = {
	showJiraApply: false,
	votes: [],
};

export default VotedModal;
