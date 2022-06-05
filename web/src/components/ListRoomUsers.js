import {
	CircularProgress,
	List,
	ListItem,
	ListItemButton,
	Paper,
} from "@mui/material";
import { useRoomUsers } from "../store";
import AddUser from "./AddUser";

const ListRoomUsers = () => {
	const users = useRoomUsers();
	if (users === undefined) {
		return <CircularProgress />;
	}
	return (
		<Paper elevation={2}>
			<List>
				<ListItem key="title">Room users ({users.length})</ListItem>
				{users.map((user) => (
					<ListItemButton key={user}>{user}</ListItemButton>
				))}
				<ListItem>
					<AddUser />
				</ListItem>
			</List>
		</Paper>
	);
};

export default ListRoomUsers;
