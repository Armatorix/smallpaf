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
import RevealModal from "./RevealModal";
import VotedModal from "./VotedModal";
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
				{room.Tickets !== undefined &&
					room.Tickets.slice(0)
						.reverse()
						.map((ticket) => (
							<ListItem key={ticket.ID}>
								<IconButton
									edge="start"
									aria-label="delete"
									target="_blank"
									href={`${
										new URL(`/browse/${ticket.JiraID}`, room.JiraUrl).href
									}`}
								>
									<LinkIcon />
								</IconButton>
								<ListItemText
									primary={ticket.JiraID}
									secondary={ticket.Description}
								/>

								{!ticket.Revealed && (
									<RevealModal
										ticketid={ticket.ID}
										roomid={room.ID}
										voted={ticket.TotalVoted}
										disabled={ticket.TotalVoted === 0}
									/>
								)}
								{!ticket.Revealed && (
									<VoteModal
										edge="end"
										ticketid={ticket.ID}
										vote={userVotesMap[ticket.ID]}
									/>
								)}
								{ticket.Revealed && (
									<VotedModal
										edge="end"
										ticket={ticket}
										withjirasync={room.JiraToken !== ""}
									/>
								)}
							</ListItem>
						))}
			</List>
		</Paper>
	);
};

export default ListRoomTickets;
