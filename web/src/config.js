let ENDPOINT = window.location.origin;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	ENDPOINT = "http://localhost:8080";
}

let WS_ENDPOINT = "ws://" + ENDPOINT.split("://")[1];
export { ENDPOINT, WS_ENDPOINT };
