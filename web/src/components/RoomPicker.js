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
	const [roomPicker, setRoomPicker] = useState(undefined);

	if (user === undefined || currentRoom === undefined) {
		return <CircularProgress />;
	}

	if (roomPicker !== undefined) {
		if (!window.location.pathname.includes(roomPicker)) {
			resetCurrentRoom();
			return <Navigate to={`/rooms/${roomPicker}`} />;
		}
		setRoomPicker(undefined);
	}

	return (
		<StyledAutocomplete
			label="Room"
			value={currentRoom}
			options={user.Rooms}
			disableClearable
			onChange={(_, v) => {
				setRoomPicker(v.ID);
			}}
			isOptionEqualToValue={(option, value) => option.ID === value.ID}
			getOptionLabel={(option) =>
				`${option.Name} - ${option.JiraUrl} - ${option.ID}`
			}
			renderInput={(params) => <TextField {...params} label="Room" />}
		/>
	);
};

export default RoomPicker;
