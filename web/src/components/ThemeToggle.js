import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { darkTheme, themeState, useToggleTheme } from "../store";

export default function ThemeToggle() {
    const theme = useRecoilValue(themeState);
    const toggleThemeState = useToggleTheme();

    return (
        <IconButton sx={{ ml: 1 }} onClick={toggleThemeState} color="inherit">
            {theme === darkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}
