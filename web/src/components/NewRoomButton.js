import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
const ColorButton = styled(Button)(({ theme }) => ({
	height: "4em",
	borderColor: theme.palette.grey[600],
	color: theme.palette.text.primary,
	marginRight: "0.2em",
}));

const NewRoomButton = () => (
	<ColorButton variant="outlined" color="primary" href="/rooms">
		<AddIcon />
		New room
	</ColorButton>
);

export default NewRoomButton;
