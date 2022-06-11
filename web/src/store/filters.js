import { atom, useRecoilState } from "recoil";

const hideVotedLocalStorageKey = "hideVoted";
const hideSubmittedLocalStorageKey = "hideSubmitted";

export const hideVotedState = atom({
	key: "hideVotedState",
	default:
		localStorage.getItem(hideVotedLocalStorageKey) !== null
			? localStorage.getItem(hideVotedLocalStorageKey) === "true"
			: false,
});
export const hideSubmittedState = atom({
	key: "hideSubmittedState",
	default:
		localStorage.getItem(hideSubmittedLocalStorageKey) !== null
			? localStorage.getItem(hideSubmittedLocalStorageKey) === "true"
			: false,
});

export const useHideVoted = () => {
	const [hideVoted, set] = useRecoilState(hideVotedState);
	const setHideVoted = (newValue) => {
		set(newValue);
		localStorage.setItem(hideVotedLocalStorageKey, newValue);
	};
	return [hideVoted, setHideVoted];
};

export const useHideSubmitted = () => {
	const [hideSubmitted, set] = useRecoilState(hideSubmittedState);
	const setHideSubmitted = (newValue) => {
		set(newValue);
		localStorage.setItem(hideSubmittedLocalStorageKey, newValue);
	};
	return [hideSubmitted, setHideSubmitted];
};
