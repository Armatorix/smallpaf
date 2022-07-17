import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import useStatesUpdates from "../api";

const DisplayTicketInfoModal = (props) => {
	const [open, setOpen] = useState(false);
	const [issue, setIssue] = useState(undefined);
	const { jiraGetIssue } = useStatesUpdates
	console.log(issue);
	useEffect(() => {
		if (!open) {
			return;
		}
		jiraGetIssue(props.jiraurl, props.email, props.jiratoken, props.ticketid)
			.then((resp) => {
				setIssue(resp);

			})
			.catch((err) => {
				console.log(err);
			});
	}, [open, props.ticketid, props.jiraurl, props.jiratoken, props.email, jiraGetIssue]);

	return (
		<>
			<IconButton
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				color="primary"
			>
				{props.voted}
				<VisibilityIcon />
			</IconButton>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle justifyContent="center">
					Ticket {props.ticketid}
				</DialogTitle>
				<DialogActions>
					<Button
						variant="outlined"
						fullWidth
						onClick={() => {
							setOpen(false);
						}}
						color="warning"
						startIcon={<CancelIcon />}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

DisplayTicketInfoModal.defaultProps = {
	ticketid: "",
	jiraurl: "",
	jiratoken: "",
	email: "",
};

export default DisplayTicketInfoModal;
