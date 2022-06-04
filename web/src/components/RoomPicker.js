import { Grid, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { currentRoomState, userState } from "../store"

const RoomPicker = () => {
    const currentRoom = useRecoilValue(currentRoomState)
    const user = useRecoilValue(userState)
    const [roomPicker, setRoomPicker] = useState(undefined)

    if (user === undefined) {
        return <CircularProgress />
    }

    if (roomPicker !== undefined && roomPicker !== currentRoom?.ID) {
        return <Navigate to={`/rooms/${roomPicker}`} />
    }


    return <Grid item container width="auto">
        <Button variant="outlined" href="/rooms"> <AddIcon />New room</Button>
        <FormControl>

            <InputLabel id="room-picker">Room</InputLabel>
            <Select
                labelId="room-picker"
                id="room-picker-select"
                label="Room"
                value={(currentRoom !== undefined) ? currentRoom.ID : ""}
                onChange={(e) => {
                    setRoomPicker(e.target.value)
                }}
            >
                {user.Rooms.map((room) =>
                    <MenuItem value={room.ID} key={room.ID}>
                        {room.Name}
                    </MenuItem>)}
            </Select>
        </FormControl>
    </Grid>
}

export default RoomPicker
