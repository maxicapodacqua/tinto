import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AddCircleOutlineOutlined, PlusOneRounded } from "@mui/icons-material";
import { Autocomplete, Box, Container, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useQuery } from 'urql';
import {graphql} from '../../src/gql';


const wineSearchQuery = graphql(`query WineSearch($wine: String) {
    allReds(filter: {q: $wine}, perPage:10, page: 0) {
      wine,
      image,
      id
    }
  }`);


export default function Likes() {

    const [wineName, setWineName] = useState('');
    const [wineSelected, setWineSelected] = useState<any>({});
    const [wineOptions, setWineOptions] = useState<[]>([]);
    const [{data}] = useQuery({
        query: wineSearchQuery,
        pause: wineName === '' || wineName.length < 3,
        variables: {
            wine: wineName,
        }
    });

    // const alerta = alert;
    // alerta('Me llamo maxi');

    return <>
        <Container maxWidth="lg">
            <Header />
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    //   alignItems: 'center',
                }}
            >
                <Typography variant="h4" component="p" gutterBottom>
                    Wines you liked
                    <IconButton>
                        <AddCircleOutlineOutlined />
                    </IconButton>
                </Typography>
                {/* <TextField value={wineName} onChange={(evt) => setWineName(evt.target.value)} /> */}
                <Autocomplete
                    freeSolo
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    value={wineName}
                    options={data?.allReds?.map((w) => (
                        {
                            value: w?.id,
                            label: w?.wine,
                        }
                    )) || []}
                    renderInput={(params) => (
                        <TextField {...params} label={'Wine name'} fullWidth />
                    )}
                    filterOptions={(x) => x}
                    onInputChange={(evt, newInputVal) => {
                        setWineName(newInputVal);
                    }}
                />
            </Box>
            <Footer />
        </Container>
    </>
}