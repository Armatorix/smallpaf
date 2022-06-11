import LinkIcon from "@mui/icons-material/Link";
import {
	Checkbox,
	CircularProgress,
	FormControlLabel,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentRoomState, userVotesMapState } from "../store";
import { useHideSubmitted, useHideVoted } from "../store/filters";
import RevealModal from "./RevealModal";
import VotedModal from "./VotedModal";
import VoteModal from "./VoteModal";

export const ListRoomTickets = () => {
	const room = useRecoilValue(currentRoomState);
	const userVotesMap = useRecoilValue(userVotesMapState);
	const [hideVoted, setHideVoted] = useHideVoted();
	const [hideSubmitted, setHideSubmitted] = useHideSubmitted();
	if (room === undefined || userVotesMap === undefined) {
		return <CircularProgress />;
	}
	console.log(hideVoted, hideSubmitted);
	return (
		<Paper elevation={2}>
			<List>
				<ListItemText>
					<Grid
						container
						order="row"
						component="FormGroup"
						style={{ paddingLeft: "5%" }}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={hideVoted}
									onChange={() => {
										setHideVoted(!hideVoted);
									}}
								/>
							}
							label="Hide voted"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={hideSubmitted}
									onChange={() => {
										setHideSubmitted(!hideSubmitted);
									}}
								/>
							}
							label="Hide submitted"
						/>
					</Grid>
				</ListItemText>
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
