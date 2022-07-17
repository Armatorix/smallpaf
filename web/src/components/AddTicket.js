import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	TextField
} from "@mui/material";
import { useState } from "react";
import { useResetRecoilState } from "recoil";
import useAPI from "../api";
import { currentRoomState } from "../store";

const defautlTicketValue = {
	Description: "",
	JiraID: "",
};
const AddTicket = (props) => {
	const [open, setOpen] = useState(false);
	const [ticket, setTicket] = useState(defautlTicketValue);
	const resetRoom = useResetRecoilState(currentRoomState);
	const { addTicket } = useAPI();

	return (
		<>
			<Button
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
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
						addTicket(props.roomid, ticket)
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
