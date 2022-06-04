import { Grid, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
const Room = () => {
    let { roomId } = useParams();
    console.log(roomId)
    return <Grid container item direction="row" xs={12}>
        <Grid item xs={4}>
            <Typography>Room {roomId}</Typography>
        </Grid>
        <Grid container item xs={8}>
        </Grid>
    </Grid>
}
export default Room;
