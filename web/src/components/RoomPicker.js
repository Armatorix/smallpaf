import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentRoomState, userState } from "../store";

const RoomPicker = () => {
	const currentRoom = useRecoilValue(currentRoomState);
	const user = useRecoilValue(userState);
	const [roomPicker, setRoomPicker] = useState(undefined);

	if (user === undefined) {
		return <CircularProgress />;
	}

	if (roomPicker !== undefined && roomPicker !== currentRoom?.ID) {
		return <Navigate to={`/rooms/${roomPicker}`} />;
	}

	return (
		<Autocomplete
			label="Room"
			value={currentRoom}
			options={user.Rooms}
			onChange={(_, v) => {
				setRoomPicker(v.ID);
			}}
			getOptionLabel={(option) => option.Name}
			renderInput={(params) => <TextField {...params} label="Room" />}
		/>
	);
};

export default RoomPicker;
