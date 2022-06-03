import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

export const DarkThemeStyle = createTheme({
  palette: {
    mode: "dark",
    primary: green,
    secondary: green,
  },
});

export const LightThemeStyle = createTheme({
  palette: {
    mode: "light",
    primary: green,
    secondary: green,
  },
});
