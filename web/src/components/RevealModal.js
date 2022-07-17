import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import PollIcon from "@mui/icons-material/Poll";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	FormControl,
	IconButton,
} from "@mui/material";
import { useState } from "react";
import { useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";

const RevealModal = (props) => {
	const [open, setOpen] = useState(false);
	const [token] = useToken();
	const resetRoom = useResetRecoilState(currentRoomState);

	return (
		<>
			<IconButton
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				color="primary"
			>
				{props.voted}
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
						fetch(`${ENDPOINT}/api/v1/rooms/${props.roomid}/tickets/${props.ticketid}/reveal`,
							{
								cache: "no-cache",
								headers: {
									"content-type": "application/json",
									authorization: `Bearer ${token}`,
								},
								method: "POST",
								mode: "cors",
							}
						)
							.then((resp) => {
								if (resp.status >= 300) {
									throw Error("failed creation");
								}
							})
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
