import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LogoutRounded } from "@mui/icons-material";
import { Box, Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";


export default function Profile(): JSX.Element {

    const { user, loading, logout } = useContext(AuthContext);

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [loading, user, router]);

    return <>
            <Header />
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h4" component="p" gutterBottom>
                    Profile
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper'
                    }}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={async () => {
                                await logout();
                            }}>
                                <ListItemIcon>
                                    <LogoutRounded />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Box>
            <Footer />
        </Container>

    </>

}