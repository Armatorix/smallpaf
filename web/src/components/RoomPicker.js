import AddIcon from "@mui/icons-material/Add"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useRecoilValue, useResetRecoilState } from "recoil"
import { currentRoomState, userState, roomFilterState } from "../store"

const RoomPicker = () => {
    const currentRoom = useRecoilValue(currentRoomState)
    const resetCurrentRoom = useResetRecoilState(roomFilterState)
    const [room, setRoom] = useState((currentRoom === undefined) ? "new-room" : currentRoom.ID)
    const user = useRecoilValue(userState)

    // FIXME: shitty solution here... :O
    if (currentRoom === undefined && room !== "new-room") {
        return <Navigate to={`/rooms/${room}`} />
    } else if (currentRoom !== undefined && room === "new-room") {
        resetCurrentRoom();
        return <Navigate to={`/rooms`} />
    }


    return <FormControl >
        <InputLabel id="room-picker">Room</InputLabel>
        <Select
            labelId="room-picker"
            id="room-picker-select"
            label="Room"
            value={room}
            onChange={(e) => {
                setRoom(e.target.value)
            }}
        >
            {user.Rooms.map((room) =>
                <MenuItem value={room.ID} key={room.ID}>
                    {room.Name}
                </MenuItem>)}
            <MenuItem key="new-room" value="new-room"><AddIcon /> New</MenuItem>
        </Select>
    </FormControl>
}

export default RoomPicker
