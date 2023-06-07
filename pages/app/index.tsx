import { AuthContext } from "@/context/auth";
import { Box, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { DatabaseContext } from "@/context/database";
import TopWines from "@/components/TopWines";
import { ThumbDownOffAlt, ThumbUpOffAlt } from "@mui/icons-material";


export default function AppHome(): JSX.Element {
    const { user, loading } = useContext(AuthContext);
    const { loading: dbLoading, topLikes, topDislikes } = useContext(DatabaseContext);

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
            return;
        }


    }, [loading, user, router])


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
                    Welcome {user?.name}
                </Typography>
                <Box sx={{ mb: 15, mt:2 }}>
                    {topLikes.length > 0 &&
                        <TopWines
                            title="❤️ Top Liked Wines"
                            topWines={topLikes}
                            metricIcon={<ThumbUpOffAlt />}
                            metricField="likes" />}
                    {topDislikes.length > 0 &&
                        <TopWines
                            title="💔 Top DisLiked Wines"
                            topWines={topDislikes}
                            metricIcon={<ThumbDownOffAlt />}
                            metricField="dislikes"
                        />}
                </Box>
            </Box>
            <Footer />
        </Container>

    </>
}