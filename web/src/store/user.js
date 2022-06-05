import { useParams } from "react-router-dom";
import { atom, useRecoilState, useRecoilValue } from "recoil";

export const userState = atom({
	key: "userState",
	default: undefined,
});

export const roomFilterState = atom({
	key: "roomFilterState",
	default: undefined,
});

export const currentRoomState = atom({
	key: "currentRoomState",
	default: undefined,
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

export const useRoomUsers = () => {
	const room = useRoom();
	return room !== undefined ? room.UserEmails : undefined;
};
