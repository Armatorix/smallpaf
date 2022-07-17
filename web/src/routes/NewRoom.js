import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import useAPI from "../api/index.js";
import { useNewRoomSetter } from "../store";

const NewRoom = () => {
	const [newRoomID, setNewRoomID] = useState(undefined);
	const setNewRoom = useNewRoomSetter();
	const [room, setRoom] = useState({
		Name: "",
		JiraURL: "https://",
		JiraToken: "",
	})
	const { newRoom } = useAPI();
	if (newRoomID) {
		return <Navigate to={`/rooms/${newRoomID}`} />;
	}
	return (
		<Grid
			item
			container
			alignSelf="center"
			alignItems="center"
			justifyContent="center"
			direction="column"
		>
			<Grid item>
				<Typography variant="h4">Create new room</Typography>
			</Grid>
			<Grid
				container
				item
				spacing={1}
				direction="column"
				component="form"
				onSubmit={(e) => {
					e.preventDefault();

					newRoom(room)
						.then((resp) => {
							setNewRoom(resp);
							setNewRoomID(resp.ID);
						})
						.catch((err) => {
							console.log(err);
						});
				}}
			>
				<Grid item>
					<TextField
						id="room"
						label="Name"
						type="text"
						fullWidth
						value={room.Name}
						onChange={(e) => setRoom({
							...room,
							Name: e.target.value,
						})}
						required
					/>
				</Grid>
				<Grid item>
					<TextField
						id="jira-url"
						label="Jira URL"
						type="url"
						fullWidth
						value={room.JiraURL}
						onChange={(e) => setRoom({
							...room,
							JiraURL: e.target.value,
						})}
					/>
				</Grid>
				<Grid item>
					<TextField
						id="jira-access-token"
						label="Jira access token"
						type="text"
						fullWidth
						value={room.JiraToken}
						onChange={(e) => setRoom({
							...room,
							JiraToken: e.target.value,
						})}
					/>
				</Grid>
				<Grid item>
					<Link
						href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/"
						target="_blank"
					>
						How to generate access token?
					</Link>
				</Grid>
				<Grid item>
					<Button
						type="submit"
						variant="outlined"
						fullWidth
						startIcon={<AddIcon />}
					>
						Create
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};
// TODO: fix the catching on http errors
export default NewRoom;
