import { ThemeProvider } from "@emotion/react";
import {
	AppBar,
	CssBaseline,
	Grid,
	Paper,
	Toolbar,
	Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import RoomPicker from "./components/RoomPicker";
import ThemeToggle from "./components/ThemeToggle";
import NewRoomButton from "./components/NewRoomButton";
import { ENDPOINT } from "./config";
import NewRoom from "./routes/NewRoom";
import NewUser from "./routes/NewUser.js";
import NewUserOpenMail from "./routes/NewUserOpenMail.js";
import Page404 from "./routes/Page404";
import Room from "./routes/Room";
import { styleState, userState, useToken } from "./store";
import LogoutButton from "./components/LogoutButton";

const redirectToRoom = () => {
	return <Navigate to="/rooms" />;
};

const redirectToLoginPage = () => {
	return <Navigate to="/" />;
};

function App() {
	const theme = useRecoilValue(styleState);
	const [token, setToken] = useToken();
	const [searchParams, setSearchParams] = useSearchParams();
	const [user, setUser] = useRecoilState(userState);
	useEffect(() => {
		const queryToken = searchParams.get("token");
		if (queryToken !== null && queryToken !== "") {
			setSearchParams(searchParams.delete("token"));
			setToken(queryToken);
		}
	}, [searchParams, setSearchParams, setToken]);
	const isAuthed = token !== "";
	useEffect(() => {
		if (token !== "" && user === undefined) {
			fetch(ENDPOINT + "/api/v1/user", {
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
					setUser(resp);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [token, setUser, user]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar style={{ margin: "1em" }}>
					<Typography variant="h5" noWrap component="div" flexGrow={1}>
						SmallPAF - Planning Async Format
					</Typography>
					{isAuthed && window.location.pathname !== "/rooms" && (
						<NewRoomButton />
					)}
					{isAuthed && user?.Rooms?.length > 0 && <RoomPicker />}
					<ThemeToggle />
					{isAuthed && <LogoutButton />}
				</Toolbar>
			</AppBar>
			<Grid
				container
				alignSelf="center"
				alignItems="center"
				width="100%"
				height="100%"
				paddingLeft="1em"
				paddingY="3em"
				justifyContent="center"
			>
				<Grid
					container
					item
					component={Paper}
					direction="column"
					spacing={2}
					width="98%"
					maxWidth="1200px"
					padding="4%"
					alignItems="center"
					justifyContent="center"
					elevation={1}
				>
					<Routes>
						<Route
							path="/"
							element={isAuthed ? redirectToRoom() : <NewUser />}
						/>
						<Route
							path="new-user-redirect"
							element={isAuthed ? redirectToRoom() : <NewUserOpenMail />}
						/>
						<Route
							path="rooms"
							element={isAuthed ? <NewRoom /> : redirectToLoginPage()}
						/>
						<Route
							path="rooms/:roomId"
							element={isAuthed ? <Room /> : redirectToLoginPage()}
						/>
						<Route path="*" element={<Page404 />} />
					</Routes>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
	// TODO: split routes on logged an not logged and make if else in code
}

export default App;
