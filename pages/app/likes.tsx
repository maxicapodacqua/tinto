import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AddCircleOutlineOutlined, PlusOneRounded } from "@mui/icons-material";
import { Autocomplete, Box, Container, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useQuery } from 'urql';


export default function Likes() {

    const [wineName, setWineName] = useState('');
    const [wineSelected, setWineSelected] = useState<any>({});
    const [wineOptions, setWineOptions] = useState<[]>([]);
    const [result] = useQuery({
        query: `query MyQ($wine: String) {
            allReds(filter: {wine: $wine}, perPage:10, page: 0) {
              wine,
              image,
              id,
          
            }
          }`,
        pause: wineName === '' || wineName.length < 3,
        variables: {
            wine: wineName,
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
                    options={[{
                        value: 'A', label: 'A',
                    }]}
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