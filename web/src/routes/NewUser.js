import { Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ENDPOINT } from "../config.js";
import SendIcon from "@mui/icons-material/Send"
export default function NewUser() {
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    if (submitted) {
        return <Navigate to={`/new-user-redirect?domain=${email.split("@")[1]}`} />
    }

    return <Grid
        container
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
    >
        <Typography variant="h4">Login with email</Typography>
        <Typography variant="body1">
            The email with the authentication link will be provided to your email.
            No passwords - just open the link and start planning your sprints!
        </Typography>
        <form onSubmit={(e) => {
            e.preventDefault();

            fetch(ENDPOINT + "/api/v1//auth/token", {
                body: JSON.stringify({ email: email }),
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
            }).then(resp => {
                if (resp.status >= 300) {
                    throw Error("failed creation")
                }
            }).then(() => {
                setSubmitted(true);
            }).catch(err => {
                console.log(err)
            });
        }}>
            <FormControl >
                <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" variant="outlined" startIcon={<SendIcon />}>
                    Send auth email
                </Button>
            </FormControl>
        </form >
    </Grid >
}
