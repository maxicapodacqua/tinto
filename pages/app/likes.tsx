import { AuthContext } from "@/context/auth";
import { Favorite, HeartBroken, Home, Menu, StyleRounded } from "@mui/icons-material";
import { AppBar, BottomNavigation, BottomNavigationAction, Box, Button, Container, Fab, IconButton, Paper, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { NextLinkComposed } from "@/Link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
export default function Likes() {
    return <>
        <Container maxWidth="lg">
            <Header />
            <h1>Likes</h1>
            <Footer />
        </Container>
    </>
}