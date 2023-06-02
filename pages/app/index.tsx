import { AuthContext } from "@/context/auth";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";


export default function AppHome(): JSX.Element {
    const { user, loading } = useContext(AuthContext);

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
                }}
            >
                <Typography variant="h4" component="p" gutterBottom>
                    Welcome {user?.name}
                </Typography>
            </Box>
            <Footer />
        </Container>

    </>
}