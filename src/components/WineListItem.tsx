import { DatabaseContext, WineModel, WineTypes } from "@/context/database";
import { DeleteRounded, OneKSharp, Recommend, ThumbDownAltOutlined, ThumbDownAltRounded, ThumbDownOffAlt, ThumbUpAltOutlined, ThumbUpOffAlt, ThumbUpRounded, WineBar } from "@mui/icons-material";
import { Badge, Checkbox, Box, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography, ListItemButton, ListItemIcon, Tooltip, capitalize } from "@mui/material";
import { blue, blueGrey, deepOrange, grey, orange, pink, purple, red, white } from "@mui/material/colors";
import { Models } from "appwrite";
import { useContext, useEffect, useState } from "react";

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


    const getWineColor = (w: WineModel): string => {
        const colorType = w.type as WineTypes;
        switch (colorType) {
            case "white":
                return grey[400];
            case "red":
                return red[900];
            case "rose":
                return pink[300];
            case "port":
                return purple[900];
            case "dessert":
                return deepOrange[700];
            case "sparkling":
                return blueGrey[200];
            default:
                return grey[50];
        }
    }

    const secondary = <Box sx={{ pt: 0.5 }}>
        <IconButton sx={{ p: 0, pr: 0.4, color: "primary.main" }}>
            <ThumbUpOffAlt />
        </IconButton>
        <Typography variant="caption">
            {stats ? stats.likes : 0}
        </Typography>

        <IconButton sx={{ p: 0, pr: 0.4, pl: 1.3, color: "primary.main" }}>
            <ThumbDownOffAlt />
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
                color="info"
                edge={'end'}
                checked={checked}
            />
        }
    >
        <ListItemButton divider  >
            <ListItemIcon sx={{ minWidth: 40 }} >
                <Tooltip title={capitalize(wine.type)}>
                    <WineBar sx={{
                        color: getWineColor(wine),
                    }} />
                </Tooltip>
            </ListItemIcon>
            <ListItemText primary={primary} secondary={secondary} />
        </ListItemButton>

    </ListItem>
}