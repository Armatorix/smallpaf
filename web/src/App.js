import { ThemeProvider } from "@emotion/react";
import {
  AppBar,
  CssBaseline, Grid, Paper, Toolbar,
  Typography
} from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil"
import ThemeToggle from "./components/ThemeToggle";
import NewRoom from "./routes/NewRoom";
import NewUser from "./routes/NewUser.js";
import NewUserOpenMail from "./routes/NewUserOpenMail.js";
import Page404 from "./routes/Page404";
import { styleState, tokenState, useToken } from "./store";

const useTokenValue = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  return query.get("token")
}

function App() {
  const theme = useRecoilValue(styleState);
  const [token, setToken] = useToken()
  const queryToken = useTokenValue()
  if (queryToken !== "") {
    setToken(queryToken);
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" noWrap component="div" flexGrow={1}>
            SmallPAF - Planning Async Format
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Grid
        container
        alignSelf="center"
        alignItems="center"
        minWidth="650px"
        width="100%"
        height="100%"
        paddingY="3em"
        justifyContent="center"
      >
        <Grid
          container
          item
          component={Paper}
          direction="column"
          spacing={2}
          width="90%"
          maxWidth="1200px"
          padding="2em"
          alignItems="center"
          justifyContent="center"
        >
          <Routes>
            <Route path="/" element={<NewUser />} />
            <Route path="new-user-redirect" element={<NewUserOpenMail />} />
            <Route path="rooms" element={<NewRoom />}>
              <Route path=":room-id" />
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Grid>
      </Grid>
    </ThemeProvider >
  );
}

export default App; 
