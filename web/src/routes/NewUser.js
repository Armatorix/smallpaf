import SendIcon from "@mui/icons-material/Send";
import {
	Button,
	FormControl,
	Grid,
	TextField,
	Typography
} from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import useAPI from "../api/index.js";
export default function NewUser() {
	const [submitted, setSubmitted] = useState(false);
	const [email, setEmail] = useState("");
	const { emailAuth } = useAPI();

	if (submitted) {
		return <Navigate to={`/new-user-redirect?domain=${email.split("@")[1]}`} />;
	}

	return (
		<Grid
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
			<FormControl
				fullWidth
				component="form"
				onSubmit={(e) => {
					e.preventDefault();
					emailAuth(email)
						.then(() => {
							setSubmitted(true);
						})
						.catch((err) => {
							console.log(err);
						});
				}}
			>
				<TextField
					id="email"
					label="Email"
					type="email"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<Button
					type="submit"
					variant="outlined"
					fullWidth
					startIcon={<SendIcon />}
				>
					Send auth email
				</Button>
			</FormControl>
		</Grid>
	);
}
