import { Grid, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { useRoom } from "../store";
const Room = () => {
    let { roomId } = useParams();
    const room = useRoom(roomId);
    return <Grid container item direction="row" xs={12}>
        <Grid item xs={4}>
            <Typography>Room <b>{room.Name}</b></Typography>
        </Grid>
        <Grid container item xs={8}>
        </Grid>
    </Grid>
}
export default Room;
