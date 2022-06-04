import { ThemeProvider } from "@emotion/react";
import {
  AppBar,
  CssBaseline, Grid, Paper, Toolbar,
  Typography
} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import ThemeToggle from "./components/ThemeToggle";
import NewUser from "./routes/NewUser.js";
import { styleState } from "./store";

function App() {
  const theme = useRecoilValue(styleState);
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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<NewUser />} />
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App; 
