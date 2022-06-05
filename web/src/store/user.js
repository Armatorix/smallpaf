import { useParams } from "react-router-dom";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

export const userState = atom({
	key: "userState",
	default: undefined,
});

export const roomFilterState = atom({
	key: "roomFilterState",
	default: undefined,
});

export const currentRoomState = selector({
	key: "currentRoomSelectorState",
	get: ({ get }) => {
		const roomId = get(roomFilterState);
		const user = get(userState);
		if (user === undefined || roomId === undefined) {
			return undefined;
		}
		let rooms = user.Rooms;
		for (const room of rooms) {
			if (room.ID === roomId) {
				return room;
			}
		}
		return undefined;
	},
});

export const useRoom = () => {
	let { roomId } = useParams();
	const currentRoom = useRecoilValue(currentRoomState);
	const [roomFilter, setRoomFilter] = useRecoilState(roomFilterState);
	if (roomFilter !== roomId) {
		setRoomFilter(roomId);
	}
	return currentRoom;
};

export const useNewRoomSetter = () => {
	const [user, setUser] = useRecoilState(userState);

	const setNewRoom = (room) => {
		if (user.Rooms === undefined) {
			setUser({
				...user,
				Rooms: [room],
			});
		} else {
			setUser({
				...user,
				Rooms: [...user.Rooms, room],
			});
		}
	};
	return setNewRoom;
};

export const useAddUserToCurrentRoomSetter = () => {
	const [user, setUser] = useRecoilState(userState);
	const roomFilter = useRecoilValue(roomFilterState);
	const addUserToCurrentRoom = (email) => {
		for (const [idx, room] of user.Rooms.entries()) {
			if (room.ID === roomFilter) {
				setUser({
					...user,
					Rooms: [
						...user.Rooms.slice(idx + 1, idx),
						{
							...room,
							UserEmails: [...room.UserEmails, email],
						},
					],
				});
			}
		}
	};
	return addUserToCurrentRoom;
};

export const useAddTicketToCurrentRoomSetter = () => {
	const [user, setUser] = useRecoilState(userState);
	const roomFilter = useRecoilValue(roomFilterState);
	const addTicketToCurrentRoom = (ticket) => {
		for (const [idx, room] of user.Rooms.entries()) {
			if (room.ID === roomFilter) {
				setUser({
					...user,
					Rooms: [
						...user.Rooms.slice(idx + 1, idx),
						{
							...room,
							Tickets: [...room.Tickets, ticket],
						},
					],
				});
			}
		}
	};
	return addTicketToCurrentRoom;
};

export const useRoomUsers = () => {
	const room = useRoom();
	return room !== undefined ? room.UserEmails : undefined;
};
