import { NextLinkComposed } from "@/Link";
import { Favorite, HeartBroken, Home } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useRouter } from "next/router";

export default function (): JSX.Element {
    const router = useRouter();

    return <Paper elevation={2} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >
        <BottomNavigation
            showLabels={true}
            value={router.asPath}
        >
            <BottomNavigationAction value={'/app'} label={'Home'} to={{ pathname: '/app' }} component={NextLinkComposed} icon={<Home />} />
            <BottomNavigationAction value={'/app/likes'} label={'Likes'} to={{ pathname: '/app/likes' }} component={NextLinkComposed} icon={<Favorite />} />
            <BottomNavigationAction value={'/app/dislikes'} label={'Dislikes'} to={{ pathname: '/app/dislikes' }} component={NextLinkComposed} icon={<HeartBroken />} />


        </BottomNavigation>
    </Paper>
}