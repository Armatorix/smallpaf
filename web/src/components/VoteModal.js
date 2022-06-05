import { useTheme } from "@emotion/react";
import { Button, Modal, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
};

const POINTS = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

const VoteModal = (props) => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();
	return (
		<>
			<Button
				{...props}
				variant="outlined"
				onClick={() => setOpen(true)}
				style={{
					minWidth: "2em",
				}}
				color={props.vote === undefined ? "warning" : "success"}
			>
				{props.vote === undefined ? "-" : props.vote.Points}
			</Button>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					alignItems="center"
					justifyContent="center"
					sx={{
						...style,
						width: 400,
						padding: "2em",
						background: theme.palette.background.paper,
						border: "2px solid #000",
					}}
				>
					{POINTS.map((point) => (
						<Button
							variant="outlined"
							sx={{
								margin: "0.4em",
								padding: "0.5em",
								justifyContent: "center",
								minWidth: "2.5em",
							}}
							onClick={() => {
								setOpen(false);
							}}
						>
							{point}
						</Button>
					))}
				</Box>
			</Modal>
		</>
	);
};
export default VoteModal;
