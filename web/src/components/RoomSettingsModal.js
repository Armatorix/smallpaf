import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	FormControl,
	IconButton,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";

const RoomSettingsModal = (props) => {
	const [open, setOpen] = useState(false);
	const [token] = useToken();
	const currentRoom = useRecoilValue(currentRoomState);
	const [jiraToken, setJiraToken] = useState(currentRoom?.JiraToken);
	const resetRoom = useResetRecoilState(currentRoomState);
	return (
		<>
			<IconButton
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				color={props.vote === undefined ? "warning" : "success"}
			>
				<SettingsIcon />
			</IconButton>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle justifyContent="center">Room settings</DialogTitle>
				<FormControl
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						fetch(`${ENDPOINT}/api/v1/rooms/${props.roomid}/jira-token`, {
							cache: "no-cache",
							body: JSON.stringify({ JiraToken: jiraToken }),
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
								resetRoom();
								setOpen(false);
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				>
					<TextField
						id="jira-token"
						label="Jira token"
						type="text"
						fullWidth
						value={jiraToken}
						onChange={(e) => setJiraToken(e.target.value)}
					/>
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
export default RoomSettingsModal;
