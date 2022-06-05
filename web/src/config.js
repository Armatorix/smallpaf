let ENDPOINT = window.location.origin;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	ENDPOINT = "http://localhost:8080";
}

export { ENDPOINT };
