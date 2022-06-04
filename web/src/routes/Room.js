import { CircularProgress, Grid, Typography } from "@mui/material";
import ListRoomUsers from "../components/ListRoomUsers";
import { useRoom } from "../store";
const Room = () => {
    const room = useRoom();
    if (room === undefined) {
        return <CircularProgress />
    }
    return <Grid container item direction="row" xs={12}>
        <Grid item xs={4}>
            <Typography>Room <b>{room.Name}</b></Typography>
        </Grid>
        <Grid container item xs={8}>
            <ListRoomUsers />
        </Grid>
    </Grid>
}
export default Room;
