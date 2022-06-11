import { atom, useRecoilState } from "recoil";

const hideVotedLocalStorageKey = "hideVoted";
const hideSubmittedLocalStorageKey = "hideSubmitted";
const hideRevealedLocalStorageKey = "hideRevealed";

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
export const hideRevealedState = atom({
	key: "hideRevealedState",
	default:
		localStorage.getItem(hideRevealedLocalStorageKey) !== null
			? localStorage.getItem(hideRevealedLocalStorageKey) === "true"
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

export const useHideRevealed = () => {
	const [hideRevealed, set] = useRecoilState(hideRevealedState);
	const setHideRevealed = (newValue) => {
		set(newValue);
		localStorage.setItem(hideRevealedLocalStorageKey, newValue);
	};
	return [hideRevealed, setHideRevealed];
};
