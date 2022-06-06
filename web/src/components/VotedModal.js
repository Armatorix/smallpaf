import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { currentRoomState, userState, useToken } from "../store";
import { ENDPOINT } from "../config";

const VotedModal = (props) => {
	const [open, setOpen] = useState(false);
	const [token] = useToken();
	const resetUser = useResetRecoilState(userState);
	const resetRoom = useResetRecoilState(currentRoomState);

	let total = 0;
	let min = props?.votes[0]?.Points;
	let max = props?.votes[0]?.Points;
	let votesGrouped = {};
	props.votes.forEach((el) => {
		if (votesGrouped[el.Points] === undefined) votesGrouped[el.Points] = 0;
		votesGrouped[el.Points] += 1;
		total += el.Points;
		if (el.Points > max) {
			max = el.Points;
		} else if (el.Points < min) {
			min = el.Points;
		}
	});
	return (
		<>
			<Button
				{...props}
				variant="contained"
				onClick={() => setOpen(true)}
				color={props.vote === undefined ? "warning" : "success"}
			>
				AVG: {(total / props.votes.length).toFixed(1)} MIN: {min} MAX: {max}
			</Button>
			<Dialog open={open} onClose={() => setOpen(false)}>
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
					<Button
						type="submit"
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
export default VotedModal;
