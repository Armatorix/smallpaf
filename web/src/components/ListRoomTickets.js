import LinkIcon from "@mui/icons-material/Link";
import { IconButton, List, ListItem, ListItemText, Paper } from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentRoomState, userState } from "../store";
const ListRoomTickets = () => {
	const room = useRecoilValue(currentRoomState);
	const user = useRecoilValue(userState);
	console.log(user);
	return (
		<Paper elevation={2}>
			<List>
				{room.Tickets.map((ticket) => (
					<ListItem key={ticket.ID}>
						<IconButton
							edge="start"
							aria-label="delete"
							target="_blank"
							href={`${new URL(`/browse/${ticket.JiraID}`, room.JiraUrl).href}`}
						>
							<LinkIcon />
						</IconButton>
						<ListItemText
							primary={ticket.JiraID}
							secondary={ticket.Description}
						/>
						<IconButton
							edge="end"
							aria-label="delete"
							target="_blank"
							href={`${new URL(`/browse/${ticket.JiraID}`, room.JiraUrl).href}`}
						>
							POINTZ
						</IconButton>
					</ListItem>
				))}
			</List>
		</Paper>
	);
};

export default ListRoomTickets;
