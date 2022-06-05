import { atom, useRecoilState } from "recoil";

const tokenLocalStorageKey = "token";

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
