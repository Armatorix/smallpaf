import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import useStatesUpdates from "../api";
import { currentRoomState } from "../store";
const AddUser = (props) => {
	const [clicked, setClicked] = useState(false);
	const [email, setEmail] = useState("");
	const resetRoom = useResetRecoilState(currentRoomState);
	const { roomId } = useParams();
	const { addUserToRoom } = useStatesUpdates();
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
				Add User
			</Button>
		);
	}
	return (
		<Grid
			item
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				addUserToRoom(roomId, email)
					.then(() => {
						resetRoom();
						setEmail("");
						setClicked(false);
					})
					.catch((err) => {
						console.log(err);
					});
			}}
		>
			<FormControl>
				<TextField
					id="email"
					label="Email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
						setEmail("");
						setClicked(false);
					}}
					color="error"
					startIcon={<CancelIcon />}
				>
					Cancel
				</Button>
			</FormControl>
		</Grid>
	);
};

export default AddUser;
