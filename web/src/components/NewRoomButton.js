import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { purple } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { color, palette } from "@mui/system";
import * as React from "react";
const ColorButton = styled(Button)(({ theme }) => {
	console.log(theme);
	return {
		height: "4em",
		borderColor: theme.palette.grey[600],
		color: theme.palette.text.primary,
		marginRight: "0.2em",
	};
});

const NewRoomButton = () => (
	<ColorButton variant="outlined" color="primary" href="/rooms">
		{" "}
		<AddIcon />
		New room
	</ColorButton>
);

export default NewRoomButton;
