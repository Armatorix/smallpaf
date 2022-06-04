import { atom, selector, useRecoilState } from "recoil";
import { LightThemeStyle, DarkThemeStyle } from "../Themes"


const themeLocalStorageKey = "theme";
const tokenLocalStorageKey = "token"
export const darkTheme = "dark";
export const lightTheme = "light";

export const themeState = atom({
    key: "themeState",
    default:
        localStorage.getItem(themeLocalStorageKey) !== null
            ? localStorage.getItem(themeLocalStorageKey)
            : lightTheme,
});

export const useToken = () => {
    const [token, set] = useRecoilState(tokenState);
    const setToken = (newValue) => {
        set(newValue);
        localStorage.setItem(tokenLocalStorageKey, newValue);
    };
    return [token, setToken];
};

export const tokenState = atom({
    key: "tokenState",
    default:
        localStorage.getItem(tokenLocalStorageKey) !== null
            ? localStorage.getItem(tokenLocalStorageKey)
            : "",
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
