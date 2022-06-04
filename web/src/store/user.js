import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";

export const userState = atom({
    key: "userState",
    default: undefined,
})

export const roomFilterState = atom({
    key: "roomFilterState",
    default: undefined,
})

export const currentRoomState = selector({
    key: "currentRoomSelectorState",
    get: ({ get }) => {
        const roomId = get(roomFilterState);
        const user = get(userState);
        if (user === undefined || roomId === undefined) {
            return undefined;
        }
        let rooms = user.Rooms
        for (const room of rooms) {
            if (room.ID === roomId) {
                return room;
            }
        }
        return undefined;
    }
})

export const useRoom = () => {
    let { roomId } = useParams();
    const currentRoom = useRecoilValue(currentRoomState)
    const [roomFilter, setRoomFilter] = useRecoilState(roomFilterState)
    if (roomFilter !== roomId) {
        setRoomFilter(roomId);
    }
    return currentRoom
}

export const useNewRoomSetter = () => {
    const [user, setUser] = useRecoilState(userState)

    const setNewRoom = (room) => {
        setUser({
            ...user,
            Rooms: [...user.Rooms, room]
        })
    }
    return setNewRoom
}

export const useAddUserToRoomSetter = () => {
    const [user, setUser] = useRecoilState(userState)

    const addUserToRoom = (roomId, email) => {
        for (const [room, idx] of user.Rooms.entries()) {
            if (room.ID === roomId) {
                user.Rooms[idx].Users.append(email)
                setUser({
                    ...user,
                    Rooms: [
                        ...user.Rooms.slice(idx + 1, idx),
                        {
                            ...room,
                            Users: [...room.Users, email]
                        }
                    ]
                })
            }
        }
    }
    return addUserToRoom
}

export const useRoomUsers = () => {
    const room = useRoom()
    return (room !== undefined) ? room.Users : undefined
}
