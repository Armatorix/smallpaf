import { Box, List, ListItem, ListItemButton, Paper, Typography } from "@mui/material"
import { useRoomUsers } from "../store"
import AddUser from "./AddUser"

const ListRoomUsers = () => {
    const users = useRoomUsers()
    return <Paper elevation={2}>
        <List>
            <ListItem key="title">
                Room users ({users.length})
            </ListItem>
            {users.map((user) => <ListItemButton key={user}>
                {user}
            </ListItemButton>)}
            <ListItem>
                <AddUser />
            </ListItem>
        </List>
    </Paper>
}

export default ListRoomUsers
