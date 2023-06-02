import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Add, CloseRounded, DeleteRounded } from "@mui/icons-material";
import { Alert, Box, Container, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext } from "@/context/database";
import { AppwriteException } from "appwrite";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";
import WineSearch, { AutocompleteSearchResult } from "@/components/WineSearch";


export default function Likes() {

    const { likes: likedWines, addLike, deleteLike, loading: dbLoading } = useContext(DatabaseContext);
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [error, setError] = useState<string | false>(false);
    const [viewLoading, setViewLoading] = useState(false);

    const handleDeleteWine = (id: string) => {
        setViewLoading(true);
        deleteLike(id)
            .catch((reason) => {
                setError('Something went wrong removing wine from your list');
                console.error(reason);
            }).finally(() => {
                setViewLoading(false);
            });
    }

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }


        if (wineSelected) {
            setViewLoading(true);
            const newLikedWine = {
                'wine_id': wineSelected.value,
                'type': wineSelected.type,
                'name': wineSelected.label,
            };
            addLike(user!, newLikedWine)
                .catch((reason: AppwriteException) => {
                    // ignore if they select a duplicate
                    if (reason.type !== 'document_already_exists') {
                        setError('Something went wrong storing your selection');
                        console.error(reason);
                    }
                }).finally(() => {
                    setViewLoading(false);
                    setShowSearch(false);
                });
        }
    }, [wineSelected, user, authLoading, router]);

    return <>
        <Container maxWidth="lg">
            <Header />
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Box>
                    {error && <Alert severity="error" >{error}</Alert>}
                    <Typography variant="h4" component="p" gutterBottom>
                        Wines you liked
                        <Tooltip title={'Search for a wine to add to your list'} >
                            <IconButton onClick={() => setShowSearch(!showSearch)}>
                                {showSearch ? <CloseRounded /> : <Add />}
                            </IconButton>
                        </Tooltip>
                    </Typography>
                </Box>
                <Box >
                    {showSearch &&
                        <Box >
                            <WineSearch
                                onSelect={(wine) => setWineSelected(wine)}
                            />
                        </Box>
                    }
                </Box>

                {likedWines.length !== 0 &&
                    <Box sx={{ my: 2, bgcolor: 'background.paper' }}>

                        <List>
                            {likedWines.map((el) => {
                                return <ListItem
                                    key={el.$id}

                                >
                                    <ListItemText primary={el.name} />
                                    <ListItemSecondaryAction  >
                                        <IconButton disabled={viewLoading} edge='end' onClick={() => {
                                            handleDeleteWine(el.$id);
                                        }}>
                                            <DeleteRounded />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            })}
                        </List>
                    </Box>
                }
            </Box>
            <Footer />
        </Container>
    </>
}