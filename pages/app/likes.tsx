import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CloseRounded, DeleteRounded, SearchRounded } from "@mui/icons-material";
import { Alert, Box, Container, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { DatabaseContext } from "@/context/database";
import { AppwriteException, ID, Models, Permission, Query, Role } from "appwrite";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";
import WineSearch, { AutocompleteSearchResult } from "@/components/WineSearch";


export default function Likes() {

    const { database } = useContext(DatabaseContext);
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [likedWines, setLikedWines] = useState<Models.Document[]>([]);
    const [error, setError] = useState<string | false>(false);
    const [viewLoading, setViewLoading] = useState(false);

    const handleDeleteWine = (id: string) => {
        setViewLoading(true);
        database.deleteDocument('tinto', 'likes', id)
            .then(() => {
                const likedWineUpdated = likedWines.filter((w) => w.$id !== id);
                setLikedWines(likedWineUpdated);
            }).finally(() => {
                setViewLoading(false);
            });
    }

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }

        if (wineSelected) {
            const role = Role.user(user!.$id);
            const newLikedWine = {
                'wine_id': wineSelected.value,
                'type': wineSelected.type,
                'name': wineSelected.label,
            };
            setViewLoading(true);
            database.createDocument('tinto', 'likes', ID.unique(), newLikedWine,
                [
                    Permission.read(role),
                    Permission.delete(role),
                    Permission.update(role),
                    Permission.write(role),
                ]
            ).then((resp) => {
                setLikedWines([resp, ...likedWines])
            }).catch((reason: AppwriteException) => {
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

        if (user && !wineSelected) {
            setViewLoading(true);
            database.listDocuments('tinto', 'likes', [
                Query.orderDesc('$createdAt'),
            ])
                .then((resp) => {
                    setLikedWines(resp.documents);
                })
                .catch((reason) => {
                    console.error(reason);
                }).finally(() => {
                    setViewLoading(false);
                });
        }


    }, [wineSelected, user, loading, router]);

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
                                {showSearch ? <CloseRounded /> : <SearchRounded />}
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