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
				<DialogActions></DialogActions>
			</Dialog>
		</>
	);
};
export default VotedModal;
