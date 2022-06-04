import { ENDPOINT } from "../config.js"
import { FormControl, InputLabel, Input, FormHelperText, Button, Typography } from "@mui/material"

export default function NewUser() {
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
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    console.log(myJson);
                });
            // TODO redirect on success
        }}>
            <FormControl >
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" aria-describedby="email-helper" required />
                <FormHelperText id="email-helper"></FormHelperText>
                <Button type="submit">
                    Send auth email
                </Button>
            </FormControl>
        </form>
    </div>
}
