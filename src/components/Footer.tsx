import { NextLinkComposed } from "@/Link";
import { HomeRounded, NoDrinksRounded, PersonRounded, WineBarRounded } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, IconButton, Paper, alpha, darken, emphasize } from "@mui/material";
import { useRouter } from "next/router";

export default function Footer(): JSX.Element {
    const router = useRouter();

    return <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >

        <Paper elevation={6} sx={{py:2}} >
            <BottomNavigation
                showLabels={true}
                value={router.asPath}
                sx={[
                    (theme) => ({
                        '.Mui-selected .MuiIconButton-root': {
                            color: theme.palette.secondary.contrastText,
                            background: theme.palette.secondary.main,
                        }
                    })
                ]}
            >
                <BottomNavigationAction value={'/app'} label={'Home'} to={{ pathname: '/app' }} component={NextLinkComposed} icon={<IconButton><HomeRounded /></IconButton>} />
                <BottomNavigationAction value={'/app/likes'} label={'Likes'} to={{ pathname: '/app/likes' }} component={NextLinkComposed} icon={<IconButton><WineBarRounded /></IconButton>} />
                <BottomNavigationAction value={'/app/dislikes'} label={'Dislikes'} to={{ pathname: '/app/dislikes' }} component={NextLinkComposed} icon={<IconButton><NoDrinksRounded /></IconButton>} />
                <BottomNavigationAction value={'/app/profile'} label={'Profile'} to={{ pathname: '/app/profile' }} component={NextLinkComposed} icon={<IconButton><PersonRounded /></IconButton>} />
            </BottomNavigation>
        </Paper>
    </Box>
}
