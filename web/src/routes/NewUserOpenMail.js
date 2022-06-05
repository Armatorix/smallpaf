import { Button, Typography } from "@mui/material";
export default function NewUser() {
	return (
		<div>
			<Typography variant="h4">Login with email</Typography>
			<Typography variant="body1">
				Open your email inbox and open the link.
			</Typography>
			<Button href="https://mail.google.com/" variant="outlined">
				Gmail
			</Button>
		</div>
	);
}
