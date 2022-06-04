import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { ENDPOINT } from "../config";
import { roomFilterState, useAddUserToRoomSetter, useToken } from "../store";
const AddUser = () => {
    const [clicked, setClicked] = useState(false)
    const token = useToken()
    const [email, setEmail] = useState("")
    const roomId = useRecoilValue(roomFilterState)
    const addUserToRoom = useAddUserToRoomSetter()

    if (!clicked) {
        return <Button variant="outlined" onClick={() => { setClicked(true) }} startIcon={<AddIcon />}> Add User</Button >
    }
    return <Grid item component="form" onSubmit={(e) => {
        e.preventDefault();

        fetch(ENDPOINT + `/api/v1/rooms/${roomId}/user`, {
            body: JSON.stringify({
                Email: email,
                RoomId: roomId
            }),
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            method: 'PUT',
            mode: 'cors',
        }).then(resp => {
            if (resp.status >= 300) {
                throw Error("failed creation")
            }
        }).then(() => {
            addUserToRoom(email)
            setEmail('')
            setClicked(false)
        }).catch(err => {
            console.log(err)
        });
    }}>
        <FormControl >
            <TextField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" variant="outlined" startIcon={<AddIcon />}>
                Add
            </Button>
        </FormControl>
    </Grid>
};

export default AddUser;
