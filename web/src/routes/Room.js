import { useParams } from "react-router-dom"
const Room = () => {
    let { roomId } = useParams();
    console.log(roomId)
    return <></>
}
export default Room;
