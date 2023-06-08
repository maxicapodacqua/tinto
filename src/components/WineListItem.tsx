import { DatabaseContext, WineModel, WineTypes } from "@/context/database";
import { ThumbDownOffAlt, ThumbUpOffAlt } from "@mui/icons-material";
import { Checkbox, Box, IconButton, ListItem, ListItemText, Typography, ListItemButton, ListItemIcon, Tooltip, capitalize, Stack } from "@mui/material";
import { amber, blueGrey, cyan, grey, pink, purple, red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { GlassWine } from 'mdi-material-ui';


type WineListItemProps = {
    wine: WineModel,
    // onDelete: (id: string) => void,
    onItemSelected: (wine: WineModel) => void,
    disableActions: boolean,
    checked: boolean,
};

export default function WineListItem({ wine, disableActions, onItemSelected, checked }: WineListItemProps): JSX.Element {


    const { getStats } = useContext(DatabaseContext);
    const [stats, setStats] = useState<any | null>(null);


    useEffect(() => {
        getStats(wine.wine_id, wine.type)
            .then((resp) => {
                setStats(resp);
            })
            .catch(console.log);
    }, []);
    const primary = <Typography
        variant="body1"
        component='p'
        fontSize={'large'}
    >
        {wine.name}
    </Typography>;


    const secondary = <Box sx={{ pt: 0.5 }}>
        <IconButton sx={{ p: 0, pr: 0.4, }}>
            <ThumbUpOffAlt fontSize="small" />
        </IconButton>
        <Typography variant="caption">
            {stats ? stats.likes : 0}
        </Typography>

        <IconButton sx={{ p: 0, pr: 0.4, pl: 1.3, }}>
            <ThumbDownOffAlt fontSize="small" />
        </IconButton>
        <Typography variant="caption">
            {stats ? stats.dislikes : 0}
        </Typography>

    </Box>;
    return <ListItem
        disablePadding
        secondaryAction={
            <Checkbox
                onChange={() => onItemSelected(wine)}
                color="primary"
                edge={'end'}
                checked={checked}
            />
        }
    >
        <ListItemButton divider  >
            <ListItemIcon sx={{ minWidth: 48 }} >
                <Tooltip title={capitalize(wine.type)}>
                    <Stack sx={{ pt: 1 }} alignItems={'center'}>
                        <GlassWine fontSize="large" />
                        <Typography color="primary" variant="subtitle2">
                            {capitalize(wine.type)[0]}
                        </Typography>
                    </Stack>
                </Tooltip>
            </ListItemIcon>
            <ListItemText primary={primary} secondary={secondary} />
        </ListItemButton>

    </ListItem>
}