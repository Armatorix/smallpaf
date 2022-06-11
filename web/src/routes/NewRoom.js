import AddIcon from "@mui/icons-material/Add";
import { Link, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ENDPOINT } from "../config.js";
import { useNewRoomSetter, useToken } from "../store";

const NewRoom = () => {
	const [newRoomID, setNewRoomID] = useState(undefined);
	const setNewRoom = useNewRoomSetter();
	const [roomName, setRoomName] = useState("");
	const [jiraURL, setJiraURL] = useState("https://");
	const [jiraToken, setJiraToken] = useState("");
	const [token] = useToken();

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

					fetch(ENDPOINT + "/api/v1/rooms", {
						body: JSON.stringify({
							Name: roomName,
							JiraUrl: jiraURL,
							JiraToken: jiraToken,
						}),
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
							return resp.json();
						})
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
						value={roomName}
						onChange={(e) => setRoomName(e.target.value)}
						required
					/>
				</Grid>
				<Grid item>
					<TextField
						id="jira-url"
						label="Jira URL"
						type="url"
						fullWidth
						value={jiraURL}
						onChange={(e) => setJiraURL(e.target.value)}
					/>
				</Grid>
				<Grid item>
					<TextField
						id="jira-access-token"
						label="Jira access token"
						type="text"
						fullWidth
						value={jiraToken}
						onChange={(e) => setJiraToken(e.target.value)}
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
