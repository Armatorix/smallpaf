import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";

const defautlTicketValue = {
	Description: "",
	JiraID: "",
};
const AddTicket = () => {
	const [clicked, setClicked] = useState(false);
	const [ticket, setTicket] = useState(defautlTicketValue);
	const [token] = useToken();
	const currentRoom = useRecoilValue(currentRoomState);
	const resetRoom = useResetRecoilState(currentRoomState);

	if (!clicked) {
		return (
			<Button
				variant="outlined"
				fullWidth
				onClick={() => {
					setClicked(true);
				}}
				startIcon={<AddIcon />}
			>
				Add Ticket
			</Button>
		);
	}
	return (
		<FormControl
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				fetch(`${ENDPOINT}/api/v1/rooms/${currentRoom.ID}/tickets`, {
					body: JSON.stringify(ticket),
					cache: "no-cache",
					headers: {
						"content-type": "application/json",
						authorization: `Bearer ${token}`,
					},
					method: "POST",
					mode: "cors",
				})
					.then((resp) => {
						if (resp.status >= 300) {
							throw Error("failed creation");
						}
					})
					.then(() => {
						setTicket(defautlTicketValue);
						resetRoom();
						setClicked(false);
					})
					.catch((err) => {
						console.log(err);
					});
			}}
		>
			<TextField
				id="jira-number"
				label="Jira Number"
				type="text"
				value={ticket.email}
				required
				onChange={(e) =>
					setTicket({
						...ticket,
						JiraID: e.target.value,
					})
				}
			/>
			<TextField
				id="description"
				label="Description"
				type="text"
				value={ticket.Description}
				onChange={(e) =>
					setTicket({
						...ticket,
						Description: e.target.value,
					})
				}
			/>
			<Button
				type="submit"
				variant="outlined"
				fullWidth
				startIcon={<AddIcon />}
			>
				Add
			</Button>
			<Button
				variant="outlined"
				fullWidth
				onClick={() => {
					setTicket(defautlTicketValue);
					setClicked(false);
				}}
				color="error"
				startIcon={<CancelIcon />}
			>
				Cancel
			</Button>
		</FormControl>
	);
};

export default AddTicket;
