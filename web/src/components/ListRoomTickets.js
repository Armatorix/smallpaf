import { List, ListItemButton, Paper } from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentRoomState } from "../store";
const ListRoomTickets = () => {
	const room = useRecoilValue(currentRoomState);
	console.log(room);
	return (
		<Paper elevation={2}>
			<List>
				{room.Tickets.map((ticket) => (
					<ListItemButton key={ticket.ID}>{ticket.JiraID}</ListItemButton>
				))}
			</List>
		</Paper>
	);
};

export default ListRoomTickets;
