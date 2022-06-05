import { useTheme } from "@emotion/react";
import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, userState, useToken } from "../store";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

const POINTS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const VoteModal = (props) => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	const [token] = useToken();
	const currentRoom = useRecoilValue(currentRoomState);
	const resetUser = useResetRecoilState(userState);
	return (
		<>
			<Button
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				style={{
					minWidth: "2em",
				}}
				color={props.vote === undefined ? "warning" : "success"}
			>
				{props.vote === undefined ? "-" : props.vote.Points}
			</Button>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					alignItems="center"
					justifyContent="center"
					sx={{
						...style,
						width: 400,
						padding: "2em",
						background: theme.palette.background.paper,
						border: "2px solid #000",
					}}
				>
					{POINTS.map((point) => (
						<Button
							key={`${props.ticketid}-${point}`}
							variant="outlined"
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
				</Box>
			</Modal>
		</>
	);
};
export default VoteModal;
