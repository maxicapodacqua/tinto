import { DatabaseContext } from "@/context/database";
import { DeleteRounded, OneKSharp, Recommend, ThumbDownAltOutlined, ThumbDownAltRounded, ThumbDownOffAlt, ThumbUpAltOutlined, ThumbUpOffAlt, ThumbUpRounded } from "@mui/icons-material";
import { Badge, Box, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography } from "@mui/material";
import { Models } from "appwrite";
import { useContext, useEffect, useState } from "react";

type WineListItemProps = {
    wine: Models.Document
    onDelete: (id: string) => void,
    disableActions: boolean,
};

export default function WineListItem({ wine, onDelete, disableActions }: WineListItemProps): JSX.Element {


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
        sx={{
        }}


    >
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
            <IconButton disabled={disableActions} edge='end' onClick={() => {
                onDelete(wine.$id)
            }}>
                <DeleteRounded />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
}