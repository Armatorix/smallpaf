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
		currentRoom === undefined || user.Rooms === undefined
			? undefined
			: user.Rooms.find((el) => currentRoom.ID === el.ID)
	);

	if (user === undefined) {
		return <CircularProgress />;
	}

	if (
		roomPicker !== undefined &&
		!window.location.pathname.includes(roomPicker.ID)
	) {
		resetCurrentRoom();
		return <Navigate to={`/rooms/${roomPicker.ID}`} />;
	}
	console.log(user.Rooms);
	return (
		<StyledAutocomplete
			label="Room"
			value={roomPicker}
			options={user.Rooms}
			disableClearable
			onChange={(_, v) => {
				setRoomPicker(v);
			}}
			isOptionEqualToValue={(option, value) => option.ID === value.ID}
			getOptionLabel={(option) =>
				option?.ID === undefined ? option : option.Name
			}
			renderInput={(params) => <TextField {...params} label="Room" />}
		/>
	);
};

export default RoomPicker;
