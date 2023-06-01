import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

import { useQuery } from 'urql';
import { graphql } from '../../src/gql';
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
export type AutocompleteSearchResult = { value: string, label: string, type: WineTypes };

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

    // console.log(allWines);

    return allWines;
}

export default function WineSearch({onSelect}: {onSelect: (wine: AutocompleteSearchResult | null) => void}) :JSX.Element {

    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [wineSearch, setWineSearch] = useState('');
    const [{ data, fetching }] = useQuery({
        query: wineSearchQuery,
        pause: wineSearch === '' || wineSearch.length < 3,
        variables: {
            wine: wineSearch,
        }
    });

    return <Autocomplete
                                // freeSolo
                                // selectOnFocus
                                // clearOnBlur
                                // handleHomeEndKeys
                                value={wineSelected || null}
                                options={parseDataIntoOptions(data)}
                                renderInput={(params) => (
                                    <TextField {...params} label={'Search wine name'} fullWidth />
                                )}
                                filterOptions={(x) => x}
                                onChange={(evt, newInputVal) => {
                                    onSelect(newInputVal);
                                    setWineSelected(newInputVal);
                                }}
                                onInputChange={(evt, newInputVal) => {
                                    setWineSearch(newInputVal);
                                }}
                                isOptionEqualToValue={(option, value) => option.value == value.value && option.type === value.type}
                            />
}