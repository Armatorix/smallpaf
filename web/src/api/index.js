import { ENDPOINT } from "../config";
import { useToken } from "../store";
import { encode } from "base-64";

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

    const emailAuth = (email) => {
        return fetch(ENDPOINT + "/api/v1/auth/token", {
            body: JSON.stringify({ Email: email }),
            cache: "no-cache",
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
            mode: "cors",
            redirect: "follow",
        })
            .then((resp) => {
                if (resp.status >= 300) {
                    throw Error("failed creation");
                }
            })
    }

    const newRoom = (room) => {
        return fetch(ENDPOINT + "/api/v1/rooms", {
            body: JSON.stringify(room),
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
                return resp.json();
            })
    }


    const jiraGetIssue = (jiraUrl, email, jiraToken, ticketId) => {
        return fetch(new URL(`/rest/api/3/issue/${ticketId}`, jiraUrl).href, {
            headers: {
                Accept: "application/json",
                Authorization: "Basic " + encode(email + ":" + jiraToken),
            },
            method: "GET",
        })
            .then((resp) => {
                if (resp.status >= 300) {
                    throw Error("failed creation");
                }
                return resp.json();
            })
    }
    return {
        newRoom,
        addTicket,
        addUserToRoom,
        getRoom,
        getUser,
        emailAuth,

        jiraGetIssue,
    }
}

export default useStatesUpdates;