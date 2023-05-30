import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AddCircleOutlineOutlined, PlusOneRounded } from "@mui/icons-material";
import { Autocomplete, Box, Container, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useQuery } from 'urql';
import { graphql } from '../../src/gql';
import { WineSearchDocument, WineSearchQuery } from "@/gql/graphql";


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

type AutocompleteSearchResult =  { value: string, label: string };
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
export default function Likes() {

    const [wineSearh, setWineSearch] = useState('');
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [{ data }] = useQuery({
        query: wineSearchQuery,
        pause: wineSearh === '' || wineSearh.length < 3,
        variables: {
            wine: wineSearh,
        }
    });

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
                <Typography variant="h4" component="p" gutterBottom>
                    Wines you liked
                    <IconButton>
                        <AddCircleOutlineOutlined />
                    </IconButton>
                </Typography>
                <Autocomplete
                    // freeSolo
                    // selectOnFocus
                    // clearOnBlur
                    // handleHomeEndKeys
                    value={wineSelected}
                    options={parseDataIntoOptions(data)}
                    renderInput={(params) => (
                        <TextField {...params} label={'Wine name'} fullWidth />
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
            <Footer />
        </Container>
    </>
}