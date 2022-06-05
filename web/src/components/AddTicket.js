import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { ENDPOINT } from "../config";
import {
	roomFilterState,
	useAddTicketToCurrentRoomSetter,
	useToken,
} from "../store";
const AddTicket = () => {
	const [clicked, setClicked] = useState(false);
	const [ticket, setTicket] = useState({
		Description: "",
		JiraNumber: "",
	});
	const [token] = useToken();
	const roomId = useRecoilValue(roomFilterState);
	const addTicketToCurrentRoom = useAddTicketToCurrentRoomSetter();

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
				fetch(`${ENDPOINT}/api/v1/rooms/${roomId}/ticket`, {
					body: JSON.stringify(ticket),
					cache: "no-cache",
					headers: {
						"content-type": "application/json",
						authorization: `Bearer ${token}`,
					},
					method: "PUT",
					mode: "cors",
				})
					.then((resp) => {
						if (resp.status >= 300) {
							throw Error("failed creation");
						}
					})
					.then(() => {
						addTicketToCurrentRoom(ticket);
						setTicket({ JiraNumber: "", Description: "" });
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
				onChange={(e) =>
					setTicket({
						...ticket,
						JiraNumber: e.target.value,
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
		</FormControl>
	);
};

export default AddTicket;
