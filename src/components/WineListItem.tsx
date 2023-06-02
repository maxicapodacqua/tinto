import { DeleteRounded, OneKSharp, Recommend, ThumbDownAltOutlined, ThumbDownAltRounded, ThumbDownOffAlt, ThumbUpAltOutlined, ThumbUpOffAlt, ThumbUpRounded } from "@mui/icons-material";
import { Badge, Box, IconButton, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography } from "@mui/material";
import { Models } from "appwrite";

type WineListItemProps = {
    wine: Models.Document
    onDelete: (id: string) => void,
    disableActions: boolean,
};

export default function WineListItem({ wine, onDelete, disableActions }: WineListItemProps): JSX.Element {

    const primary = <Typography
        variant="body1"
        component='p'
        fontSize={'large'}
    >
        {wine.name}
    </Typography>;

    // const secondary = <Badge badgeContent={100} color="secondary" overlap="rectangular" sx={{
    //     // fontSize: '1px'
    // }} anchorOrigin={{
    //     vertical: "bottom",
    //     horizontal: "right",
    // }}>
    //     <IconButton sx={{ p: 0, color: "primary.main" }}>
    //         <ThumbUpAltOutlined />
    //     </IconButton>
    // </Badge>;


    const secondary = <Box sx={{pt:0.5}}>
            <IconButton sx={{ p: 0, color: "success.main" }}>
                <ThumbUpOffAlt  />
            </IconButton>
            <Typography variant="caption">
            +99
            </Typography>

            <IconButton sx={{ p: 0, pl: 1.3, color: "error.main" }}>
                <ThumbDownOffAlt/>
            </IconButton>
            <Typography variant="caption">
            10
            </Typography>
            
        </Box>;
    return <ListItem
        key={wine.$id}
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