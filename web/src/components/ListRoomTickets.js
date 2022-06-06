import LinkIcon from "@mui/icons-material/Link";
import {
	Checkbox,
	CircularProgress,
	FormControlLabel,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
} from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	currentRoomState,
	hideRevealedTicketsState,
	userVotesMapState,
} from "../store";
import VoteModal from "./VoteModal";

export const HideRevealedCheckbox = () => {
	const [hide, setHide] = useRecoilState(hideRevealedTicketsState);
	return (
		<FormControlLabel
			control={
				<Checkbox
					checked={hide}
					onChange={() => setHide(!hide)}
					name="hide-revealed"
				/>
			}
			label="Hide revealed"
		/>
	);
};

export const ListRoomTickets = () => {
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
							ticketid={ticket.ID}
							vote={userVotesMap[ticket.ID]}
						/>
					</ListItem>
				))}
			</List>
		</Paper>
	);
};

export default ListRoomTickets;
