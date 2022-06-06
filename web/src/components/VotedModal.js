import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { currentRoomState, userState, useToken } from "../store";

const VotedModal = (props) => {
	const [open, setOpen] = useState(false);
	const [token] = useToken();
	const resetUser = useResetRecoilState(userState);
	const resetRoom = useResetRecoilState(currentRoomState);

	let total = 0;
	let min = props.votes[0].Points;
	let max = props.votes[0].Points;
	props.votes.forEach((el) => {
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
				<DialogTitle justifyContent="center"></DialogTitle>
				<DialogActions>
					2x
					<Button variant="contained">2</Button>
					3x <Button variant="contained">3</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
export default VotedModal;
