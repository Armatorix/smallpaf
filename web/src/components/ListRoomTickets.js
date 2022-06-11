import LinkIcon from "@mui/icons-material/Link";
import {
	CircularProgress,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Paper,
	TextField,
	ToggleButton,
} from "@mui/material";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
	currentRoomState,
	useAndFilter,
	useHideRevealed,
	useHideSubmitted,
	useHideVoted,
	userVotesMapState,
} from "../store";
import RevealModal from "./RevealModal";
import VotedModal from "./VotedModal";
import VoteModal from "./VoteModal";

const isTicketSearched = (ticket, searchBy, andFilter) => {
	if (searchBy === "") {
		return true;
	}
	// get search words
	let words = searchBy
		.toLowerCase()
		.split(" ")
		.map((s) => s.trim())
		.filter((s) => s !== "");
	let description = ticket.Description.toLowerCase();
	let ticketNo = ticket.JiraID.toLowerCase();
	if (andFilter) {
		for (let i = 0; i < words.length; i++) {
			if (!description.includes(words[i]) && !ticketNo.includes(words[i])) {
				return false;
			}
		}
		return true;
	} else {
		for (let i = 0; i < words.length; i++) {
			if (description.includes(words[i]) || ticketNo.includes(words[i])) {
				return true;
			}
		}
		return false;
	}
};

export const ListRoomTickets = () => {
	const room = useRecoilValue(currentRoomState);
	const userVotesMap = useRecoilValue(userVotesMapState);
	const [hideVoted, setHideVoted] = useHideVoted();
	const [hideSubmitted, setHideSubmitted] = useHideSubmitted();
	const [hideRevealed, setHideRevealed] = useHideRevealed();
	const [andFilter, setAndFilter] = useAndFilter();
	const [textFilter, setTextFilter] = useState("");
	if (room === undefined || userVotesMap === undefined) {
		return <CircularProgress />;
	}
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
						<ToggleButton
							selected={hideVoted}
							onChange={() => {
								setHideVoted(!hideVoted);
							}}
						>
							Hide voted
						</ToggleButton>

						<ToggleButton
							selected={hideRevealed}
							onChange={() => {
								setHideRevealed(!hideRevealed);
							}}
						>
							Hide revealed
						</ToggleButton>
						<ToggleButton
							selected={hideSubmitted}
							onChange={() => {
								setHideSubmitted(!hideSubmitted);
							}}
						>
							Hide submitted
						</ToggleButton>
						<TextField
							id="text-filter"
							label="Filter"
							variant="outlined"
							value={textFilter}
							onChange={(e) => setTextFilter(e.target.value)}
						/>
						<ToggleButton
							selected={true}
							onChange={() => {
								setAndFilter(!andFilter);
							}}
						>
							{andFilter ? "AND" : "OR"}
						</ToggleButton>
					</Grid>
				</ListItemText>
				{room.Tickets !== undefined &&
					room.Tickets.slice(0)
						.filter(
							(el) =>
								!(hideVoted && userVotesMap[el.ID]) &&
								!(hideSubmitted && el.JiraPoints !== 0) &&
								!(hideRevealed && el.Revealed) &&
								isTicketSearched(el, textFilter, andFilter)
						)
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
