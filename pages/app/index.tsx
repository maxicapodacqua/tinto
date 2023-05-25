import { AuthContext } from "@/context/auth";
import { Menu, StyleRounded } from "@mui/icons-material";
import { AppBar, Box, Button, Fab, IconButton, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';



export default function (): JSX.Element {
    const { logout, user, loading } = useContext(AuthContext);


    const router = useRouter();


    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router])


    return <>

        <Box sx={{
            marginTop: 8,
            marginLeft: 2,
            marginRight: 2,
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
        }}
        >
            <Box sx={{
                // alignContent: 'center',
            }}>

                <Typography component="h1" variant="h5">
                    Welcome
                </Typography>
                <Button variant="contained" color="secondary" onClick={async () => {
                    await logout();
                }}>Logout</Button>
            </Box>
        </Box>

        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer">
                    <MenuIcon />
                </IconButton>
                <Fab color="secondary" aria-label="add">
                    <AddIcon />
                </Fab>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit">
                    <SearchIcon />
                </IconButton>
                <IconButton color="inherit">
                    <MoreIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    </>
}