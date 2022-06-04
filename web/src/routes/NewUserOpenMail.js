import { Typography } from "@mui/material"
import { useParams } from "react-router-dom"
export default function NewUser() {
    const { emailDomain } = useParams
    return <div>
        <Typography variant="h4">Login with email</Typography>
        <Typography variant="body1">Open your email inbox and open the link.</Typography>
    </div>
}
