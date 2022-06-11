import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
} from "@mui/material";
import { encode } from "base-64";
import { useEffect, useState } from "react";
const DisplayTicketInfoModal = (props) => {
	const [open, setOpen] = useState(false);
	const [issue, setIssue] = useState(undefined);
	useEffect(() => {
		if (!open) {
			return;
		}
		fetch(new URL(`/rest/api/3/issue/${props.ticketid}`, props.jiraurl).href, {
			headers: {
				Accept: "application/json",
				Authorization: "Basic " + encode(props.email + ":" + props.jiratoken),
			},
			method: "GET",
		})
			.then((resp) => {
				if (resp.status >= 300) {
					throw Error("failed creation");
				}
				return resp.json();
			})
			.then((resp) => {
				setIssue(resp);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [open, props.ticketid, props.jiraurl, props.jiratoken, props.email]);

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
