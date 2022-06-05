import LinkIcon from "@mui/icons-material/Link";
import {
	CircularProgress,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentRoomState, userVotesMapState } from "../store";
import VoteModal from "./VoteModal";
const ListRoomTickets = () => {
	const room = useRecoilValue(currentRoomState);
	const userVotesMap = useRecoilValue(userVotesMapState);
	if (room === undefined || userVotesMap === undefined) {
		return <CircularProgress />;
	}
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
						<VoteModal
							edge="end"
							ticket={ticket.ID}
							vote={userVotesMap[ticket.ID]}
						/>
					</ListItem>
				))}
			</List>
		</Paper>
	);
};

export default ListRoomTickets;
