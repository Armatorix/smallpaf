import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, userState, useToken } from "../store";

const POINTS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const VoteModal = (props) => {
	const [open, setOpen] = useState(false);
	const [token] = useToken();
	const currentRoom = useRecoilValue(currentRoomState);
	const resetUser = useResetRecoilState(userState);
	const resetRoom = useResetRecoilState(currentRoomState);
	return (
		<>
			<Button
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				style={{
					minWidth: "3.5em",
				}}
				color={props.vote === undefined ? "warning" : "success"}
			>
				{props.vote === undefined ? "-" : props.vote.Points}
			</Button>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle justifyContent="center">Pick your estimation</DialogTitle>
				<DialogActions>
					{POINTS.map((point) => (
						<Button
							key={`${props.ticketid}-${point}`}
							variant={point === props?.vote?.Points ? "contained" : "outlined"}
							sx={{
								margin: "0.4em",
								padding: "0.5em",
								justifyContent: "center",
								minWidth: "2.5em",
							}}
							onClick={() => {
								addVote(currentRoom.ID, props.ticketid, point)
									.then(() => {
										resetUser();
										resetRoom();
										setOpen(false);
									})
									.catch((err) => {
										console.log(err);
									});
							}}
						>
							{point}
						</Button>
					))}
				</DialogActions>
			</Dialog>
		</>
	);
};
export default VoteModal;
