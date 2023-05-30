import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CloseRounded, DeleteRounded, SearchRounded } from "@mui/icons-material";
import { Autocomplete, Box, Container, IconButton, LinearProgress, List, ListItem, ListItemSecondaryAction, ListItemText, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

import { useQuery } from 'urql';
import { graphql } from '../../src/gql';
import { WineSearchQuery } from "@/gql/graphql";


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

type AutocompleteSearchResult = { value: string, label: string };
const parseDataIntoOptions = (data: WineSearchQuery | undefined): AutocompleteSearchResult[] => {

    if (!data) {
        return [];
    }
    const mapper = (w: { id: string, wine: string }): AutocompleteSearchResult => ({
        value: w?.id,
        label: w?.wine,
    });

    const allWines: AutocompleteSearchResult[] = [];

    data.allReds?.forEach((w) => {
        allWines.push(mapper(w!));
    });
    data.allWhites?.forEach((w) => {
        allWines.push(mapper(w!));
    });

    data.allRoses?.forEach((w) => {
        allWines.push(mapper(w!));
    });

    data.allPorts?.forEach((w) => {
        allWines.push(mapper(w!));
    });

    data.allDesserts?.forEach((w) => {
        allWines.push(mapper(w!));
    });

    data.allSparklings?.forEach((w) => {
        allWines.push(mapper(w!));
    });

    return allWines;
}

const mock = ["Emporda 2012", "Vosne-Romanée Cros Parantoux 1990", "Vosne-Romanée Cros Parantoux 1996", "Grand Vin Pauillac (Premier Grand Cru Classé) 1982", "Château Margaux (Premier Grand Cru Classé) 2000", "Pauillac (Premier Grand Cru Classé) 2003", "Grand Vin Pauillac (Premier Grand Cru Classé) 2003", "Saint-Émilion Grand Cru (Premier Grand Cru Classé) 1990",
"Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959","Vosne-Romanée Cros Parantoux N.V.",
"Pauillac (Premier Grand Cru Classé) 1959",
];

export default function Likes() {

    const [showSearch, setShowSearch] = useState(false);
    const [wineSearh, setWineSearch] = useState('');
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [{ data, fetching }] = useQuery({
        query: wineSearchQuery,
        pause: wineSearh === '' || wineSearh.length < 3,
        variables: {
            wine: wineSearh,
        }
    });

    return <>
            {fetching && <LinearProgress/>}
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
                        {mock.map((el) => {
                            return <ListItem
                                divider
                            >
                                <ListItemText primary={el} />
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