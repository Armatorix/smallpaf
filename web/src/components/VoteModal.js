import { useTheme } from "@emotion/react";
import { IconButton, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

const VoteModal = (props) => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	console.log(theme);
	console.log(props);
	return (
		<>
			<IconButton onClick={() => setOpen(true)}>XD</IconButton>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					sx={{
						...style,
						width: 400,
						padding: "2em",
						background: theme.palette.background.paper,
						border: "2px solid #000",
					}}
				>
					<Typography>Text in a modal</Typography>
				</Box>
			</Modal>
		</>
	);
};
export default VoteModal;
