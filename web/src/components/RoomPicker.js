import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { currentRoomState, userState } from "../store";

const StyledAutocomplete = styled(Autocomplete)(() => ({
	minWidth: "15%",
}));

const RoomPicker = () => {
	const currentRoom = useRecoilValue(currentRoomState);
	const resetCurrentRoom = useResetRecoilState(currentRoomState);
	const user = useRecoilValue(userState);
	const [roomPicker, setRoomPicker] = useState(
		currentRoom !== undefined ? currentRoom.ID : ""
	);

	if (user === undefined) {
		return <CircularProgress />;
	}

	if (
		roomPicker !== undefined &&
		!window.location.pathname.includes(roomPicker)
	) {
		console.log(roomPicker, currentRoom);
		resetCurrentRoom();
		return <Navigate to={`/rooms/${roomPicker}`} />;
	}

	return (
		<StyledAutocomplete
			label="Room"
			value={roomPicker}
			options={user.Rooms}
			disableClearable
			onChange={(_, v) => {
				setRoomPicker(v.ID);
			}}
			isOptionEqualToValue={(option, value) => option.ID === value}
			getOptionLabel={(option) =>
				option.ID === undefined ? option : option.ID
			}
			renderInput={(params) => <TextField {...params} label="Room" />}
		/>
	);
};

export default RoomPicker;
