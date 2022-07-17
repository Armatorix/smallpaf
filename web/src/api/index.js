import { useSetRecoilState } from "recoil";
import { ENDPOINT } from "../config";
import { currentRoomState, useToken } from "../store";

const useStatesUpdates = () => {
    const token = useToken()[0];
    const setRoom = useSetRecoilState(currentRoomState);

    const updateRoomState = (roomId) => {
        fetch(ENDPOINT + `/api/v1/rooms/${roomId}`, {
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
            })
            .then((resp) => {
                setRoom(resp)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return {
        updateRoomState,
    }
}

export default useStatesUpdates;