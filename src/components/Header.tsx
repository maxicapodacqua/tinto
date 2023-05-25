import { AuthContext } from "@/context/auth";
import { Favorite, HeartBroken, Home, Logout, Settings, StyleRounded } from "@mui/icons-material";
import { AppBar, BottomNavigation, BottomNavigationAction, Menu, Box, Button, Container, Fab, IconButton, Paper, Toolbar, Tooltip, Typography, MenuItem, ListItemIcon } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { NextLinkComposed } from "@/Link";
import Footer from "@/components/Footer";

export default function Header() {

    const {logout} = useContext(AuthContext);

    // const [settingsOpen, setSettingsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
    return <>
        <Box sx={{
            // mx: 2,
            mt: 2,
            display: 'flex',
            justifyContent: 'right',
        }}>
            <Tooltip title={'Settings'}>
                <IconButton
                    size="small"
                    onClick={(evt) => setAnchorEl(evt.currentTarget)}
                >
                    <Settings sx={{ width: 24, height: 24 }} />
                </IconButton>
            </Tooltip>
        </Box>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClick={() => setAnchorEl(null)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
                elevation: 0,
            }}
        >
            <MenuItem onClick={async () => {
                await logout();
            }}>
                <ListItemIcon>
                    <Logout fontSize={"small"} />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    </>;
}