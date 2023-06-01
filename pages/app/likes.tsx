import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CloseRounded, DeleteRounded, SearchRounded } from "@mui/icons-material";
import { Autocomplete, Box, Container, IconButton, LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

import { useQuery } from 'urql';
import { graphql } from '../../src/gql';
import { DatabaseContext } from "@/context/database";
import { ID, Models, Permission, Query, Role } from "appwrite";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";
import { Red, White, Rose, Dessert, Port, Sparkling, WineSearchQuery } from "@/gql/graphql";


const wineSearchQuery = graphql(`query WineSearch($wine: String) {
    allReds(filter: {q: $wine}, perPage:10, page: 0) {
        wine,
        id,
      }
      allWhites(filter: {q: $wine}, perPage:10, page: 0) {
        wine,
        id,
      }
      allRoses(filter: {q: $wine}, perPage:10, page: 0) {
        wine,
        id,
      }
      allPorts(filter: {q: $wine}, perPage:10, page: 0) {
        wine,
        id,
      }
      allDesserts(filter: {q: $wine}, perPage:10, page: 0) {
        wine,
        id,
      }
      allSparklings(filter: {q: $wine}, perPage:10, page: 0) {
        wine,
        id,
      }
  }`);

type WineTypes = 'red' | 'white' | 'rose' | 'port' | 'dessert' | 'sparkling';
type AutocompleteSearchResult = { value: string, label: string, type: WineTypes };

const parseDataIntoOptions = (data: WineSearchQuery | undefined): AutocompleteSearchResult[] => {

    if (!data) {
        return [];
    }
    const mapper = (w: White | Red | Rose | Dessert | Port | Sparkling): AutocompleteSearchResult => ({
        value: w?.id,
        label: w?.wine,
        type: w?.__typename?.toLowerCase() as WineTypes,
    });

    const allWines: AutocompleteSearchResult[] = [];

    data.allReds?.forEach((w) => {
        allWines.push(mapper(w as Red));
    });
    data.allWhites?.forEach((w) => {
        allWines.push(mapper(w as White));
    });

    data.allRoses?.forEach((w) => {
        allWines.push(mapper(w as Rose));
    });

    data.allPorts?.forEach((w) => {
        allWines.push(mapper(w as Port));
    });

    data.allDesserts?.forEach((w) => {
        allWines.push(mapper(w as Dessert));
    });

    data.allSparklings?.forEach((w) => {
        allWines.push(mapper(w as Sparkling));
    });

    return allWines;
}

export default function Likes() {

    const { user, loading } = useContext(AuthContext);
    const router = useRouter();
    // useEffect(() => {
    //     if (!loading && !user) {
    //         router.push('/');
    //     }
    // }, [loading, user, router]);
    const [showSearch, setShowSearch] = useState(false);
    const [wineSearch, setWineSearch] = useState('');
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [likedWines, setLikedWines] = useState<Models.Document[]>([]);
    const { database } = useContext(DatabaseContext);
    const [{ data, fetching }] = useQuery({
        query: wineSearchQuery,
        pause: wineSearch === '' || wineSearch.length < 3,
        variables: {
            wine: wineSearch,
        }
    });


    useEffect(() => {
        if (!wineSelected || !user) {
            return;
        }

        const role = Role.user(user!.$id);
        const newLikedWine = {
            'wine_id': wineSelected.value,
            'type': wineSelected.type,
            'name': wineSelected.label,
        };
        database.createDocument('tinto', 'likes', ID.unique(), newLikedWine,
            [
                Permission.read(role),
                Permission.delete(role),
                Permission.update(role),
                Permission.write(role),
            ]
        ).then((resp) => {
            setLikedWines([resp, ...likedWines])
        }).finally(() => {
            setWineSelected(null);
            setShowSearch(false);
        });

    }, [wineSelected, user]);

    useEffect(() => {
        if (!user) {
            return;
        }
        database.listDocuments('tinto', 'likes', [
            Query.orderDesc('$createdAt'),
        ])
            .then((resp) => {
                setLikedWines(resp.documents);
            })
            .catch((reason) => {
                console.error(reason);
            })
    }, [user]);

    return <>
        {fetching && <LinearProgress />}
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
                            <Autocomplete
                                // freeSolo
                                // selectOnFocus
                                // clearOnBlur
                                // handleHomeEndKeys
                                value={wineSelected}
                                options={parseDataIntoOptions(data)}
                                renderInput={(params) => (
                                    <TextField {...params} label={'Search wine name'} fullWidth />
                                )}
                                filterOptions={(x) => x}
                                onChange={(evt, newInputVal) => {
                                    setWineSelected(newInputVal);
                                }}
                                onInputChange={(evt, newInputVal) => {
                                    setWineSearch(newInputVal);
                                }}
                            />
                        </Box>
                    }
                </Box>
                <Box sx={{ my: 2, bgcolor: 'background.paper' }}>

                    <List>
                        {likedWines.map((el) => {
                            return <ListItem
                                key={el.$id}
                                divider
                            >
                                <ListItemText primary={el.name} />
                                <ListItemSecondaryAction >
                                    <IconButton edge='end'>
                                        <DeleteRounded />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        })}
                    </List>

                </Box>
            </Box>
            <Footer />
        </Container>
    </>
}