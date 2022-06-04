import { Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { useResetRecoilState } from "recoil";
import RefreshIcon from '@mui/icons-material/Refresh';
import ListRoomUsers from "../components/ListRoomUsers";
import { useRoom, userState } from "../store";
const Room = () => {
    const room = useRoom();
    const reloadUser = useResetRecoilState(userState)
    if (room === undefined) {
        return <CircularProgress />
    }
    return <Grid container item direction="column" xs={12}>
        <Grid item xs={4}>
            <Typography>
                Room <b>{room.Name}</b>
                <IconButton onClick={() => {
                    reloadUser();
                }}> <RefreshIcon /></IconButton>
            </Typography>
        </Grid>
        <Grid container item direction="row">
            <Grid container item xs={8}>
                XD
            </Grid>
            <Grid container item xs={4}>
                <ListRoomUsers />
            </Grid>
        </Grid>
    </Grid>
}
export default Room;
