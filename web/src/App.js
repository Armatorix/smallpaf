import { ThemeProvider } from "@emotion/react";
import {
  AppBar,
  CssBaseline, Toolbar,
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
          <Typography variant="h6" noWrap component="div" flexGrow={1}>
            SmallPAF - Planning Async Format
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewUser />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 
