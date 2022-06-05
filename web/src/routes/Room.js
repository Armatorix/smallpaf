import { CircularProgress, Grid, Link, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import AddTicket from "../components/AddTicket";
import ListRoomTickets from "../components/ListRoomTickets";
import ListRoomUsers from "../components/ListRoomUsers";
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
			<Grid container item direction="column" xs={8}>
				<Typography>
					Room <b>{room.Name}</b> <br />
					<Link href={room.JiraUrl}>{room.JiraUrl}</Link>
				</Typography>
				<AddTicket />
				<ListRoomTickets />
			</Grid>
			<Grid container item direction="column" xs={4}>
				<ListRoomUsers />
			</Grid>
		</Grid>
	);
};
export default Room;
