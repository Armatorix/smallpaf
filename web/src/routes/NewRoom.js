import AddIcon from "@mui/icons-material/Add";
import { Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ENDPOINT } from "../config.js";
import { useNewRoomSetter, useToken } from "../store"

const NewRoom = () => {
    const [newRoomID, setNewRoomID] = useState(undefined);
    const setNewRoom = useNewRoomSetter()
    const [roomName, setRoomName] = useState('');
    const [jiraURL, setJiraURL] = useState('https://');
    const [token] = useToken()

    if (newRoomID) {
        return <Navigate to={`/rooms/${newRoomID}`} />
    }
    return <Grid
        container
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        direction="column"
    >
        <Grid item>
            <Typography variant="h4">Create new room</Typography>
        </Grid>
        <Grid item component="form" spacing={3} onSubmit={(e) => {
            e.preventDefault();

            fetch(ENDPOINT + "/api/v1/rooms", {
                body: JSON.stringify({
                    Name: roomName,
                    JiraUrl: jiraURL
                }),
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                method: 'POST',
                mode: 'cors',
            }).then(resp => {
                if (resp.status >= 300) {
                    throw Error("failed creation")
                }
                return resp.json()
            }).then((resp) => {
                setNewRoom(resp)
                setNewRoomID(resp.ID);
            }).catch(err => {
                console.log(err)
            });
        }}>
            <FormControl >
                <TextField id="room" label="Name" type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
                <TextField id="jira-url" label="Jira URL" type="url" value={jiraURL} onChange={(e) => setJiraURL(e.target.value)} />
                <Button type="submit" variant="outlined" startIcon={<AddIcon />}>
                    Create
                </Button>
            </FormControl>

        </Grid>
    </Grid >
}
// TODO: fix the catching on http errors
export default NewRoom
