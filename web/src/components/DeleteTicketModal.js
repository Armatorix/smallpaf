import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
	Button, Dialog,
	DialogActions, DialogTitle, IconButton
} from "@mui/material";
import { useState } from "react";
import { useResetRecoilState } from "recoil";
import useAPI from "../api";
import { currentRoomState } from "../store";


const DeleteTicketModal = (props) => {
	const [open, setOpen] = useState(false);
	const { deleteTicket } = useAPI()
	const resetRoom = useResetRecoilState(currentRoomState);

	return (
		<>
			<IconButton
				{...props}
				variant="contained"
				onClick={() => setOpen(true)}
				color="warning"
			>
				<DeleteForeverIcon />
			</IconButton>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle justifyContent="center">Do you want to delete the ticket?</DialogTitle>
				<DialogActions>
					<Button
						variant="contained"
						fullWidth
						onClick={(e) => {
							e.preventDefault();
							deleteTicket(props.ticket.RoomId, props.ticket.ID)
								.then(() => {
									resetRoom();
									setOpen(false);
								})
								.catch((err) => {
									console.log(err);
								});
						}}
						startIcon={<DeleteForeverIcon />}
						color="error"
					>
						Yes
					</Button>
					<Button
						variant="outlined"
						fullWidth
						onClick={() => {
							setOpen(false);
						}}
						color="success"
						startIcon={<CancelIcon />}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

DeleteTicketModal.defaultProps = {
	ticket: {
		ID: "",
		RoomId: "",
	},
};

export default DeleteTicketModal;
