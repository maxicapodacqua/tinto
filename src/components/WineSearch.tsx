import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormLabel, Grid, List, ListItem, Radio, RadioGroup, TextField, capitalize, createFilterOptions } from "@mui/material";
import { FormEvent, useState } from "react";

import { useQuery } from 'urql';
import { graphql } from '../../src/gql';
import { Red, White, Rose, Dessert, Port, Sparkling, WineSearchQuery } from "@/gql/graphql";
import { WineTypes, wineTypesConsts } from "@/context/database";

const filter = createFilterOptions<AutocompleteSearchResult>();


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

export type AutocompleteSearchResult = { value: string, label: string, type: WineTypes, isUserCustom?: boolean };

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

export default function WineSearch({ onSelect }: { onSelect: (wine: AutocompleteSearchResult | null) => void }): JSX.Element {

    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [wineSearch, setWineSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [{ data, fetching }] = useQuery({
        query: wineSearchQuery,
        pause: wineSearch === '' || wineSearch.length < 3,
        variables: {
            wine: wineSearch,
        }
    });


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(data);
        console.log(data.get('type'));
        // setError(false);

        // if (data.get('password') !== data.get('confirmPassword')) {
        //     setError("Password don't match");
        //     return;
        // }

        // signup(data.get('email') as string, data.get('password') as string, data.get('name') as string)
        //     .catch((e: AppwriteException) => setError(e.message));

    };

    return <>
        <Autocomplete
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            loading={fetching}
            value={wineSelected || null}
            options={parseDataIntoOptions(data)}
            renderInput={(params) => (
                <Box sx={{ m: 0, bgcolor: 'background.paper' }}>
                    <List >
                        <ListItem divider  >
                            <TextField {...params} variant="standard" label={'Search your wine to add name'} fullWidth />
                        </ListItem>
                    </List>
                </Box>
            )}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);

                // Adds special option to trigger dialog
                if (params.inputValue !== '') {
                    filtered.push({
                        label: `Add "${params.inputValue}"`,
                        value: params.inputValue,
                        type: "red",
                        isUserCustom: true,
                    });
                }

                return filtered;
            }}
            onChange={(evt, newInputVal) => {
                console.log(newInputVal);
                if (typeof newInputVal === "string") {

                } else if (newInputVal?.isUserCustom) {
                    setOpenDialog(true);
                    setWineSelected(newInputVal);
                } else {
                    setWineSelected(newInputVal);
                    onSelect(newInputVal);
                }
            }}
            onInputChange={(evt, newInputVal) => {
                setWineSearch(newInputVal);
            }}
            isOptionEqualToValue={(option, value) => option.value == value.value && option.type === value.type}
        />
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <form  onSubmit={handleSubmit} >
                <DialogTitle>Add a new wine</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Did we miss a wine in the list?
                    </DialogContentText>


                    <TextField
                        sx={{ mb: 2 }}
                        margin="dense"
                        fullWidth
                        name="name"
                        required
                        id="name"
                        label="Name"
                        value={wineSelected?.value}
                    />

                    <FormLabel id='wine-types'>Type</FormLabel>
                    <RadioGroup
                        aria-labelledby='wine-types'
                        name='type'
                        // row
                        defaultValue={wineTypesConsts[0]}
                    >
                        {wineTypesConsts.map(type => (
                            <FormControlLabel value={type} control={<Radio />} label={capitalize(type)} />
                        ))}

                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" color="secondary" variant="contained">Add</Button>
                </DialogActions>
            </form>
        </Dialog>
    </>
}