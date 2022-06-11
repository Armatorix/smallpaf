import { CircularProgress, Grid, Link, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import AddTicket from "../components/AddTicket";
import ImportTicketsModal from "../components/ImportTicketsModal";
import ListRoomTickets from "../components/ListRoomTickets";
import ListRoomUsers from "../components/ListRoomUsers";
import RoomSettingsModal from "../components/RoomSettingsModal";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";
const Room = () => {
	const [token] = useToken();
	const [room, setRoom] = useRecoilState(currentRoomState);
	const { roomId } = useParams();
	useEffect(() => {
		if (token !== "" && room === undefined) {
			fetch(ENDPOINT + `/api/v1/rooms/${roomId}`, {
				cache: "no-cache",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${token}`,
				},
				method: "GET",
				mode: "cors",
			})
				.then((resp) => {
					if (resp.status >= 300) {
						throw Error("failed to get user provfile");
					}
					return resp.json();
				})
				.then((resp) => {
					setRoom(resp);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [token, room, setRoom, roomId]);

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
						{room.JiraToken === "" && (
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
