import { Button, Grid } from "@mui/material"

const Page404 = () => {
    return <Grid
        container
        alignSelf="center"
        alignItems="center"
        justifyContent="center"
        direction="column"
    >
        <img src={`${process.env.PUBLIC_URL}/404.jpg`} alt="404-not-found" />
        <Button href="/" variant="outlined">Home</Button >
    </Grid>

}

export default Page404
