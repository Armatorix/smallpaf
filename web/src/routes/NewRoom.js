import AddIcon from "@mui/icons-material/Add";
import { Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ENDPOINT } from "../config.js";

const NewRoom = () => {
    const [submitted, setSubmitted] = useState(false);
    const [roomName, setRoomName] = useState('');

    if (submitted) {
        return <Navigate to={`/room/:TODO`} />
    }
    return <Grid
        container
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        direction="column"
    >
        <Grid
            item>
            <Typography variant="h4">Create new room</Typography>
        </Grid>
        <Grid item>
            <form onSubmit={(e) => {
                e.preventDefault();

                fetch(ENDPOINT + "/room", {
                    body: JSON.stringify({ name: roomName }),
                    cache: 'no-cache',
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST',
                    mode: 'cors',
                    redirect: 'follow',
                }).then(resp => {
                    if (resp.status !== 201) {
                        throw Error("failed creation")
                    }
                }).then(() => {
                    setSubmitted(true);
                }).catch(err => {
                    console.log(err)
                });
            }}>
                <FormControl >
                    <TextField id="room" label="Name" type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
                    <Button type="submit" variant="outlined" startIcon={<AddIcon />}>
                        Create
                    </Button>
                </FormControl>
            </form >

        </Grid>
    </Grid >
}

export default NewRoom
