import LinkIcon from "@mui/icons-material/Link";
import { IconButton, List, ListItem, ListItemText, Paper } from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentRoomState, userVotesMapState } from "../store";
import VoteModal from "./VoteModal";
const ListRoomTickets = () => {
	const room = useRecoilValue(currentRoomState);
	const userVotesMap = useRecoilValue(userVotesMapState);
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
							ticket={ticket.ID}
							vote={
								userVotesMap[ticket.ID] !== undefined
									? userVotesMap[ticket.ID]
									: undefined
							}
						/>
						<VoteModal edge="end" />
					</ListItem>
				))}
			</List>
		</Paper>
	);
};

export default ListRoomTickets;
