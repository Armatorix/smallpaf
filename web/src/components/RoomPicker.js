import { Grid, Button, CircularProgress, FormControl, InputLabel, MenuItem, Autocomplete, TextField } from "@mui/material"
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


    return <Grid container item width="auto">
        <Button variant="outlined" href="/rooms"> <AddIcon />New room</Button>
        <Autocomplete
            label="Room"
            value={currentRoom}
            options={user.Rooms}
            onChange={(_, v) => {
                setRoomPicker(v.ID)
            }}
            getOptionLabel={(option) => option.Name}
            renderInput={(params) => <TextField {...params} label="Room" />}
        />
    </Grid >
}

export default RoomPicker