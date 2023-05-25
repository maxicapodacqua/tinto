import { NextLinkComposed } from "@/Link";
import { HomeRounded, NoDrinksRounded, WineBarRounded } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, IconButton, Paper } from "@mui/material";
import { useRouter } from "next/router";

export default function Footer(): JSX.Element {
    const router = useRouter();

    return <Paper elevation={6} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >
        <BottomNavigation
            showLabels={true}
            value={router.asPath}
        >
            <BottomNavigationAction value={'/app'} label={'Home'} to={{ pathname: '/app' }} component={NextLinkComposed} icon={<IconButton><HomeRounded /></IconButton>} />
            <BottomNavigationAction value={'/app/likes'} label={'Likes'} to={{ pathname: '/app/likes' }} component={NextLinkComposed} icon={<IconButton><WineBarRounded /></IconButton>} />
            <BottomNavigationAction value={'/app/dislikes'} label={'Dislikes'} to={{ pathname: '/app/dislikes' }} component={NextLinkComposed} icon={<IconButton><NoDrinksRounded /></IconButton>} />


        </BottomNavigation>
    </Paper>
}