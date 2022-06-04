import { CircularProgress, Grid, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import AddUser from "../components/AddUser";
import { useRoom } from "../store";
const Room = () => {
    let { roomId } = useParams();
    const room = useRoom(roomId);
    if (room === undefined) {
        return <CircularProgress />
    }
    return <Grid container item direction="row" xs={12}>
        <Grid item xs={4}>
            <Typography>Room <b>{room.Name}</b></Typography>
        </Grid>
        <Grid container item xs={8}>
            <AddUser />
        </Grid>
    </Grid>
}
export default Room;
