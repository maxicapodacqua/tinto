import { AuthContext } from "@/context/auth";
import { Favorite, HeartBroken, Home, Menu, Settings, StyleRounded } from "@mui/icons-material";
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Button, Container, Fab, IconButton, Paper, Toolbar, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { NextLinkComposed } from "@/Link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";



export default function (): JSX.Element {
    const { logout, user, loading } = useContext(AuthContext);


    const router = useRouter();


    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router])


    return <>


        <Container maxWidth="lg">
            <Header/>
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    //   alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome
                </Typography>
                <Button variant="contained" color="secondary" onClick={async () => {
                    await logout();
                }}>Logout</Button>
            </Box>
            <Footer />
        </Container>

    </>
}