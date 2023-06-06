import { NextLinkComposed } from "@/Link";
import { DeleteRounded, HomeRounded, NoDrinksRounded, PersonRounded, WineBarRounded } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, IconButton, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useRouter } from "next/router";

export default function Footer(): JSX.Element {
    const router = useRouter();

    return <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >
        {/* <Box
        sx={{position:'relative', right: 50, bottom: 10}}
        > */}
            {/* <Fab
                        sx={{
                            position: 'fixed',
                            bottom: spacing(10),
                            right: spacing(3),
                        }}
                    >
                        <DeleteRounded />
                    </Fab> */}
            {/* <SpeedDial
            
                ariaLabel="options"
                icon={<SpeedDialIcon />}
            //   sx={{ position: 'fixed', bottom: spacing(8), right: spacing(24) }}

            >
                <SpeedDialAction
                    icon={<DeleteRounded />}
                    tooltipTitle={'delete'}
                    title={'delete'}
                />
            </SpeedDial> */}
        {/* </Box> */}

        <Paper elevation={6} sx={{ pb: 2 }} >
            <BottomNavigation
                showLabels={true}
                value={router.asPath}
            >
                <BottomNavigationAction value={'/app'} label={'Home'} to={{ pathname: '/app' }} component={NextLinkComposed} icon={<IconButton><HomeRounded /></IconButton>} />
                <BottomNavigationAction value={'/app/likes'} label={'Likes'} to={{ pathname: '/app/likes' }} component={NextLinkComposed} icon={<IconButton><WineBarRounded /></IconButton>} />
                <BottomNavigationAction value={'/app/dislikes'} label={'Dislikes'} to={{ pathname: '/app/dislikes' }} component={NextLinkComposed} icon={<IconButton><NoDrinksRounded /></IconButton>} />
                <BottomNavigationAction value={'/app/profile'} label={'Profile'} to={{ pathname: '/app/profile' }} component={NextLinkComposed} icon={<IconButton><PersonRounded /></IconButton>} />


            </BottomNavigation>
        </Paper>
    </Box>
}
