import LinkIcon from "@mui/icons-material/Link";
import {
	CircularProgress,
	Grid,
	IconButton,
	InputAdornment,
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
	userState,
	userVotesMapState,
} from "../store";
import DisplayTicketInfoModal from "./DisplayTicketInfoModal";
import RevealModal from "./RevealModal";
import VotedModal from "./VotedModal";
import VoteModal from "./VoteModal";
import DeleteTicketModal from "./DeleteTicketModal";

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
	const user = useRecoilValue(userState);
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
						style={{ paddingLeft: "2%", paddingRight: "2%" }}
						spacing={2}
					>
						<Grid container item xs={12} lg={6}>
							<Grid container item xs={4}>
								<ToggleButton
									fullWidth
									selected={hideVoted}
									onChange={() => {
										setHideVoted(!hideVoted);
									}}
									style={{ fontSize: "0.6em" }}
								>
									Hide voted
								</ToggleButton>
							</Grid>
							<Grid container item xs={4}>
								<ToggleButton
									fullWidth
									selected={hideRevealed}
									onChange={() => {
										setHideRevealed(!hideRevealed);
									}}
									style={{ fontSize: "0.6em" }}
								>
									Hide revealed
								</ToggleButton>
							</Grid>
							<Grid container item xs={4}>
								<ToggleButton
									fullWidth
									selected={hideSubmitted}
									onChange={() => {
										setHideSubmitted(!hideSubmitted);
									}}
									style={{ fontSize: "0.6em" }}
								>
									Hide submitted
								</ToggleButton>
							</Grid>
						</Grid>
						<Grid container item xs={12} lg={6}>
							<TextField
								id="text-filter"
								label="Filter"
								variant="outlined"
								value={textFilter}
								onChange={(e) => setTextFilter(e.target.value)}
								fullWidth
								InputProps={{
									endAdornment: (
										<InputAdornment>
											<ToggleButton
												selected={true}
												onChange={() => {
													setAndFilter(!andFilter);
												}}
											>
												{andFilter ? "AND" : "OR"}
											</ToggleButton>
										</InputAdornment>
									),
								}}
							/>
						</Grid>
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

								<DeleteTicketModal edge="start" ticket={ticket} />

								{false && room.JiraToken !== "" && (
									<DisplayTicketInfoModal
										edge="start"
										aria-label="delete"
										ticketid={ticket.JiraID}
										jiraurl={room.JiraUrl}
										jiratoken={room.JiraToken}
										email={user.Email}
									/>
								)}
								<ListItemText
									primary={ticket.JiraID}
									secondary={ticket.Description}
								/>

								{!ticket.Revealed && (
									<RevealModal
										ticket={ticket}
										roomid={room.ID}
										disabled={ticket.Votes.length === 0}
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
