import { useSetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";

const useStatesUpdates = () => {
    const token = useToken()[0];

    const getRoom = (roomId) => {
        return fetch(ENDPOINT + `/api/v1/rooms/${roomId}`, {
            cache: "no-cache",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "GET",
            mode: "cors",
        })
            .then((resp) => {
                if (resp.status >= 300) {
                    throw Error("failed to get user provfile");
                }
                return resp.json();
            });
    }

    const addTicket = (roomId, ticket) => {
        return fetch(`${ENDPOINT}/api/v1/rooms/${roomId}/tickets`, {
            body: JSON.stringify(ticket),
            cache: "no-cache",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "POST",
            mode: "cors",
        })
            .then((resp) => {
                if (resp.status >= 300) {
                    throw Error("failed creation");
                }
            });
    }

    return {
        getRoom,
        addTicket,
    }
}

export default useStatesUpdates;