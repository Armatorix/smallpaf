import { Button, FormControl, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ENDPOINT } from "../config.js";

export default function NewUser() {
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    if (submitted) {
        return <Navigate to={`/new-user-redirect?domain=${email.split("@")[1]}`} replace={true} />
    }

    return <div className="App">
        <Typography variant="h4">Login with email</Typography>
        <Typography variant="body1">
            The email with the authentication link will be provided to your email.
            No passwords - just open the link and start planning your sprints!
        </Typography>
        <form onSubmit={(e) => {
            e.preventDefault();

            fetch(ENDPOINT + "/auth/token", {
                body: JSON.stringify({ email: e.target.email.value }),
                cache: 'no-cache',
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
            })
                .then(() => {
                    setSubmitted(true);
                });
        }}>
            <FormControl >
                <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit">
                    Send auth email
                </Button>
            </FormControl>
        </form>
    </div>
}
