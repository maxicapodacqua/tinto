import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Add, AddRounded, CloseRounded, DeleteRounded, OneKSharp, WineBar, WineBarOutlined } from "@mui/icons-material";
import { Alert, Backdrop, Box, Container, Fab, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext, WineModel } from "@/context/database";
import { AppwriteException } from "appwrite";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";
import WineSearch, { AutocompleteSearchResult } from "@/components/WineSearch";
import WineListItem from "@/components/WineListItem";


export default function Likes() {

    const theme = useTheme();
    const { likes: likedWines, addLike, deleteLike, refresh, } = useContext(DatabaseContext);
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [error, setError] = useState<string | false>(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [selection, setSelection] = useState<WineModel[]>([]);

    const delayInc = 500;
    const handleDeleteSelection = () => {
        setViewLoading(true);
        setError(false);

        const proms: Promise<void>[] = [];

        selection.forEach((s, i) => {
            proms.push(
                new Promise(
                    (resolve) => setTimeout(resolve, delayInc * (i + 1))
                )
                    .then(() => deleteLike(s.$id))
            );
        });

        Promise.all(proms)
            .catch((reason) => {
                console.error(reason);
                setError('Something went wrong removing wine from your list');
            })
            .finally(() => {
                // Needing to refresh because appwrite backend is failing at handling multiple delete requests
                // with a 500 error
                refresh();
                setSelection([]);
                setViewLoading(false);
                setSpeedDialOpen(false);
            });
    }

    const handleWineSelection = (wine: WineModel) => {
        const currentIndex = selection.indexOf(wine);
        const newSelection = [...selection];

        if (currentIndex === -1) {
            newSelection.push(wine);
        } else {
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
    }

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }


        if (wineSelected) {
            setViewLoading(true);
            const newLikedWine = {
                'wine_id': wineSelected.value,
                'user_id': user?.$id,
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
                    <Box sx={{ my: 2, mb: 15, bgcolor: 'background.paper' }}>

                        <List >
                            {likedWines.map((el) =>
                                <WineListItem
                                    key={el.$id}
                                    wine={el}
                                    checked={selection.indexOf(el) !== -1}
                                    disableActions={viewLoading}
                                    // onDelete={handleDeleteWine}
                                    onItemSelected={handleWineSelection}
                                />
                            )}
                        </List>
                    </Box>
                }
                <Box sx={{
                    position: 'relative',
                    // position: 'fixed',
                    // bottom: theme.spacing(10),
                    // right: theme.spacing(3),
                    // height: 'auto',
                    // transform: 'translateZ(0px)',
                }}>
                    <SpeedDial


                        open={speedDialOpen}
                        onOpen={() => setSpeedDialOpen(true)}
                        onClose={() => setSpeedDialOpen(false)}
                        sx={{
                            position: 'fixed',
                            bottom: theme.spacing(10),
                            right: theme.spacing(3.5),
                        }}
                        // FabProps={{color: 'primary'}}
                        // FabProps={{
                        //     sx: {
                        //         position: 'fixed',
                        //         bottom: spacing(10),
                        //         right: spacing(3),
                        //     }
                        // }}
                        ariaLabel="options"
                        icon={<SpeedDialIcon openIcon={<WineBar />} icon={<WineBarOutlined />} />}
                    >
                        <SpeedDialAction
                            tooltipOpen
                            onClick={handleDeleteSelection}
                            tooltipTitle={'Delete'}
                            title={'Delete'}
                            FabProps={{
                                disabled: selection.length === 0,
                            }}
                            icon={
                                <DeleteRounded color={selection.length === 0 ? "inherit" : "secondary"} />
                            }
                        />


                        <SpeedDialAction
                            tooltipOpen
                            tooltipTitle={'Add wine'}
                            title={'Add wine'}
                            icon={
                                <AddRounded color="secondary" />
                            }
                        />


                    </SpeedDial>
                </Box>
            </Box>
            <Footer />
        </Container>
    </>
}