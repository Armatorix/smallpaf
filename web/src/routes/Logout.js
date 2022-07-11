import { Navigate } from "react-router-dom";
import { useToken } from "../store";

const Logout = () => {
	const [, setToken] = useToken();
	setToken(null);
	return <Navigate to={`/`} />;
};
export default Logout;
