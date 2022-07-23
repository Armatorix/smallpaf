import { CircularProgress } from "@mui/material";
import useWS from "../ws";

export const RoomChat = (props) => {
	useWS(props.roomId);
	if (props === undefined || props.roomId === undefined) {
		return <CircularProgress />;
	}
	return <>XD</>;
};
