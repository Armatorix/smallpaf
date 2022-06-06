import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, userState, useToken } from "../store";

const VotedModal = (props) => {
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
								fetch(
									`${ENDPOINT}/api/v1/rooms/${currentRoom.ID}/tickets/${props.ticketid}/votes`,
									{
										body: JSON.stringify({
											Points: point,
										}),
										cache: "no-cache",
										headers: {
											"content-type": "application/json",
											authorization: `Bearer ${token}`,
										},
										method: "PUT",
										mode: "cors",
									}
								)
									.then((resp) => {
										if (resp.status >= 300) {
											throw Error("failed creation");
										}
									})
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
export default VotedModal;
