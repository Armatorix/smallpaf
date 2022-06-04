import { atom, selector, useRecoilState } from "recoil";
import { LightThemeStyle, DarkThemeStyle } from "../Themes"


const themeLocalStorageKey = "theme";
export const darkTheme = "dark";
export const lightTheme = "light";

export const themeState = atom({
    key: "themeState",
    default:
        localStorage.getItem(themeLocalStorageKey) !== null
            ? localStorage.getItem(themeLocalStorageKey)
            : lightTheme,
});

export const useToggleTheme = () => {
    const [theme, setTheme] = useRecoilState(themeState);
    const toggle = () => {
        const newTheme = theme === lightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        localStorage.setItem(themeLocalStorageKey, newTheme);
    };
    return toggle;
};

export const styleState = selector({
    key: "styleState",
    get: ({ get }) => {
        const theme = get(themeState)
        return (theme === lightTheme) ? LightThemeStyle : DarkThemeStyle
    }
})
