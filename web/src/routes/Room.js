import { CircularProgress, Grid, Link, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import useAPI from "../api";
import AddTicket from "../components/AddTicket";
import ImportTicketsModal from "../components/ImportTicketsModal";
import ListRoomTickets from "../components/ListRoomTickets";
import ListRoomUsers from "../components/ListRoomUsers";
import RoomSettingsModal from "../components/RoomSettingsModal";
import { currentRoomState } from "../store";

const Room = () => {
	const { roomId } = useParams();
	const [room, setRoom] = useRecoilState(currentRoomState);
	const { getRoom } = useAPI()
	useEffect(() => {
		if (room === undefined) {
			getRoom(roomId).then((resp) => {
				setRoom(resp)
			}).catch((err) => {
				console.log(err)
			})
		}
	}, [room, roomId, setRoom, getRoom]);

	if (room === undefined) {
		return <CircularProgress />;
	}
	return (
		<Grid container item direction="row" spacing={4} xs={12}>
			<Grid container item direction="column" xs={12} md={8}>
				<Grid container item direction="row">
					<Grid item xs={12} md={6}>
						<Grid container direction="row">
							<RoomSettingsModal roomid={roomId} />
							<Typography>
								Room <b>{room.Name}</b> <br />
								<Link href={room.JiraUrl} target="_blank">
									{room.JiraUrl}
								</Link>
							</Typography>
						</Grid>
					</Grid>
					<Grid item xs={12} md={3}>
						{room.JiraToken !== "" && (
							<ImportTicketsModal fullWidth roomid={roomId} />
						)}
					</Grid>
					<Grid item xs={12} md={3}>
						<AddTicket fullWidth roomid={roomId} />
					</Grid>
				</Grid>

				<ListRoomTickets />
			</Grid>
			<Grid container item direction="column" xs={12} md={4}>
				<ListRoomUsers />
			</Grid>
		</Grid>
	);
};
export default Room;
