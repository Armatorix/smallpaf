import { createTheme } from "@mui/material";
import { deepPurple, green } from "@mui/material/colors";

export const DarkThemeStyle = createTheme({
	palette: {
		mode: "dark",
		primary: green,
		secondary: deepPurple,
	},
});

export const LightThemeStyle = createTheme({
	palette: {
		mode: "light",
		primary: green,
		secondary: deepPurple,
	},
});
