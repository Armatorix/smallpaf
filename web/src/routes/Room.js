import { CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import AddTicket from "../components/AddTicket";
import ListRoomUsers from "../components/ListRoomUsers";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";
import { useParams } from "react-router-dom";
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
		<Grid container item direction="column" xs={12}>
			<Grid item xs={4}>
				<Typography>
					Room <b>{room.Name}</b>
				</Typography>
			</Grid>
			<Grid container item direction="row">
				<Grid container item xs={8}>
					<AddTicket />
					XD
				</Grid>
				<Grid container item xs={4}>
					<ListRoomUsers />
				</Grid>
			</Grid>
		</Grid>
	);
};
export default Room;
