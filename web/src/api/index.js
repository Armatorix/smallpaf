import { ENDPOINT } from "../config";
import { useToken } from "../store";

const useStatesUpdates = () => {
    const [token, setToken] = useToken();

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

    const getUser = () => {
        return fetch(ENDPOINT + "/api/v1/user", {
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
                    if (resp.status === 401) {
                        setToken(null)
                    }
                    throw Error("failed to get user provfile");
                }
                return resp.json();
            })
    }
    const addUserToRoom = (roomId, email) => {
        return fetch(`${ENDPOINT}/api/v1/rooms/${roomId}/user`, {
            body: JSON.stringify({
                Email: email,
            }),
            cache: "no-cache",
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "PUT",
            mode: "cors",
        })
            .then((resp) => {
                if (resp.status >= 300) {
                    throw Error("failed creation");
                }
            })
    }

    return {
        getRoom,
        addTicket,
        getUser,
        addUserToRoom,
    }
}

export default useStatesUpdates;