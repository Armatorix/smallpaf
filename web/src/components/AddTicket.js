import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";

const defautlTicketValue = {
	Description: "",
	JiraID: "",
};
const AddTicket = (props) => {
	const [open, setOpen] = useState(false);
	const [ticket, setTicket] = useState(defautlTicketValue);
	const [token] = useToken();
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
				startIcon={<AddIcon />}
				color="primary"
			>
				Add ticket
			</Button>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<FormControl
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						fetch(`${ENDPOINT}/api/v1/rooms/${props.roomid}/tickets`, {
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
								setOpen(false);
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					<DialogTitle justifyContent="center">Add new ticket</DialogTitle>
					<DialogContent>
						<DialogContent>
							<TextField
								id="jira-number"
								label="Jira Number"
								type="text"
								value={ticket.email}
								fullWidth
								required
								onChange={(e) =>
									setTicket({
										...ticket,
										JiraID: e.target.value,
									})
								}
							/>
						</DialogContent>
						<DialogContent>
							<TextField
								id="description"
								label="Description"
								type="text"
								value={ticket.Description}
								fullWidth
								multiline
								inputProps={{
									maxLength: 512,
								}}
								onChange={(e) =>
									setTicket({
										...ticket,
										Description: e.target.value,
									})
								}
							/>
						</DialogContent>
					</DialogContent>
					<DialogActions>
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
								setOpen(false);
							}}
							color="error"
							startIcon={<CancelIcon />}
						>
							Cancel
						</Button>
					</DialogActions>
				</FormControl>
			</Dialog>
		</>
	);
};

export default AddTicket;
