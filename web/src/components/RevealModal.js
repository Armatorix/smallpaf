import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import PollIcon from "@mui/icons-material/Poll";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useResetRecoilState } from "recoil";
import useAPI from "../api";
import { currentRoomState } from "../store";

const RevealModal = (props) => {
	const [open, setOpen] = useState(false);
	const { revealTicket } = useAPI();
	const resetRoom = useResetRecoilState(currentRoomState);

	return (
		<>
			<IconButton
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				color="primary"
			>
				{props.ticket.Votes.length}
				<PollIcon />
			</IconButton>
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
						revealTicket(props.roomid, props.ticket.ID)
							.then(() => {
								resetRoom();
								setOpen(false);
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					<DialogTitle justifyContent="center">
						ARE YOU READY FOR THE BIG REVEAL?
					</DialogTitle>
					<DialogContent>
						<Typography>Voted</Typography>
						{props.ticket.Votes.map((vote) => (
							<>
								{vote.UserEmail} <br />
							</>
						))}
					</DialogContent>
					<DialogActions>
						<Button
							type="submit"
							variant="outlined"
							fullWidth
							startIcon={<CheckIcon />}
						>
							Reveal
						</Button>
						<Button
							variant="outlined"
							fullWidth
							onClick={() => {
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

export default RevealModal;
