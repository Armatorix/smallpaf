import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "../store";

const LogoutButton = () => {
	const setToken = useToken()[1];
	const [clicked, setClicked] = useState(false);
	if (clicked) {
		return <Navigate to="/" />;
	}
	return (
		<IconButton
			sx={{ ml: 1 }}
			onClick={() => {
				setToken(null);
				setClicked(true);
			}}
			color="inherit"
		>
			<LogoutIcon />
		</IconButton>
	);
};

export default LogoutButton;
