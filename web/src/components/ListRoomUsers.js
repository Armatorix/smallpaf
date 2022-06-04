import { useRoomUsers } from "../store"

const ListRoomUsers = () => {
    const users = useRoomUsers()
    console.log(users)
    return
}

export default ListRoomUsers
