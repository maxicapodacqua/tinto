import { Add, AddCircle, AddCircleOutlineRounded, AddCircleRounded, AddOutlined, AddRounded, DeleteRounded, WineBar, WineBarOutlined } from "@mui/icons-material";
import { Alert, Box, ClickAwayListener, Container, IconButton, List, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DatabaseContext, WineInputModel, WineModel } from "@/context/database";
import { AppwriteException, Models } from "appwrite";
import { AuthContext } from "@/context/auth";
import { useRouter } from "next/router";
import WineSearch, { AutocompleteSearchResult } from "./WineSearch";
import WineListItem from "./WineListItem";


type Props = {
    title: string,
    wines: WineModel[],
    addWine: (user: Models.User<{}>, wine: WineInputModel) => Promise<void>,
    deleteWine: (id: string | string[]) => Promise<void>,
};
export default function WineList({title, wines, addWine, deleteWine} : Props) {

    const theme = useTheme();
    const { refresh, loading: dbLoading } = useContext(DatabaseContext);
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [wineSelected, setWineSelected] = useState<AutocompleteSearchResult | null>();
    const [error, setError] = useState<string | false>(false);
    const [viewLoading, setViewLoading] = useState(false);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [selection, setSelection] = useState<WineModel[]>([]);

    const handleDeleteSelection = () => {
        setViewLoading(true);
        setError(false);
        deleteWine(selection.map(s => s.$id))
            .catch((reason) => {
                console.error(reason);
                setError('Something went wrong removing wine from your list');
                // Needing to refresh because appwrite backend is failing at handling multiple delete requests
                // with a 500 error
                refresh();
            })
            .finally(() => {
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
            const newWine = {
                'wine_id': wineSelected.value,
                'user_id': user?.$id,
                'type': wineSelected.type,
                'name': wineSelected.label,
            };
            addWine(user!, newWine)
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
                        {title}
                    </Typography>
                </Box>
                <Box >
                    {showSearch &&
                        <ClickAwayListener onClickAway={() => setShowSearch(false)}>
                            <Box>
                                <WineSearch
                                    onSelect={(wine) => setWineSelected(wine)}
                                />
                            </Box>
                        </ClickAwayListener>
                    }
                </Box>

                {wines.length !== 0 &&
                    <Box sx={{ mb: 15, bgcolor: 'background.paper' }}>
                        <List sx={{ py: 0 }} >
                            {wines.map((el) =>
                                <WineListItem
                                    key={el.$id}
                                    wine={el}
                                    checked={selection.indexOf(el) !== -1}
                                    disableActions={viewLoading}
                                    onItemSelected={handleWineSelection}
                                />
                            )}
                        </List>
                    </Box>
                }
                {!dbLoading && wines.length === 0 && !showSearch &&
                    <Box sx={{
                        my: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Box>
                            <Typography variant="subtitle2" fontSize={'large'}>
                                Looks like you haven&apos;t added any wines to your list!
                            </Typography>
                            <IconButton onClick={() => setShowSearch(true)} >
                                <AddCircleOutlineRounded fontSize="large" color="primary" />
                            </IconButton>
                        </Box>
                    </Box>
                }
                <Box sx={{
                    position: 'relative',
                }}>
                    <SpeedDial
                        open={speedDialOpen}
                        onOpen={() => setSpeedDialOpen(true)}
                        onClose={() => setSpeedDialOpen(false)}
                        sx={{
                            position: 'fixed',
                            bottom: theme.spacing(9),
                            right: theme.spacing(3.5),
                        }}
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
                            onClick={() => {
                                setShowSearch(true);
                                setSpeedDialOpen(false)
                            }}
                            tooltipTitle={'Add wine'}
                            title={'Add wine'}
                            icon={
                                <AddRounded color="secondary" />
                            }
                        />
                    </SpeedDial>
                </Box>
            </Box>
    </>
}