import { WS_ENDPOINT } from "../config";
import { useToken } from "../store";

const useWS = (roomId) => {
	const [token, _] = useToken();
	const ws = new WebSocket(`${WS_ENDPOINT}/api/v1/ws/room/${roomId}`);
	ws.onerror = function (error) {
		console.log("ws error", error);
		ws.close();
	};

	ws.onmessage = function (msg) {
		console.log("ws receive message", msg);
	};

	ws.onclose = function () {
		console.log("ws closed");
	};

	ws.onopen = function () {
		auth();
	};
	const auth = () => {
		ws.send(
			JSON.stringify({
				type: "auth",
				data: {
					token: token,
				},
			})
		);
	};

	// TODO other messages
	return { auth };
};

export default useWS;
