import React, { useState } from 'react';
import './Navbar.css';
import { HasNameAndId } from '../../../helper/helperInterfaces';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';

export interface NavbarItem {
    name: string;
    onClick: () => void;
}

interface NavbarProps {
    username?: string; // username
    userSettings?: HasNameAndId[];
    onUserSettingSelected?: (item: HasNameAndId) => void;
    elements?: NavbarItem[];
}


const Navbar: React.FC<NavbarProps> = ({ username, userSettings, onUserSettingSelected, elements }) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <AppBar position="fixed" className='nav' id='app-navbar'>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {
                            !username ?
                                <>
                                    {/* Central Logo */}
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        component="a"
                                        sx={{
                                            mr: 2,
                                            flexGrow: 1,
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                            textAlign: username ? 'initial' : 'center', // Center the text if username is undefined
                                        }}
                                    >
                                        APP NAME
                                    </Typography>
                                    {/* Central Logo */}
                                </>
                                :
                                <>
                                    {/* Left Logo */}
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component="a"
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'none', md: 'flex' },
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        APP NAME
                                    </Typography>
                                    {/* Left Logo */}
                                    {
                                        elements &&
                                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                            <IconButton
                                                size="large"
                                                aria-controls="menu-appbar"
                                                aria-haspopup="true"
                                                onClick={handleOpenNavMenu}
                                                color="inherit"
                                            >
                                                <MenuIcon />
                                            </IconButton>
                                            <Menu
                                                id="menu-appbar"
                                                anchorEl={anchorElNav}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                open={Boolean(anchorElNav)}
                                                onClose={handleCloseNavMenu}
                                                sx={{
                                                    display: { xs: 'block', md: 'none' },
                                                }}
                                            >
                                                {elements && elements.map((element) => (
                                                    <MenuItem key={element.name} onClick={() => { element.onClick(); handleCloseNavMenu(); }}>
                                                        <Typography textAlign="center">{element.name}</Typography>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Box>
                                    }

                                    {/* Central Logo */}
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        component="a"
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'flex', md: 'none' },
                                            flexGrow: 1,
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        APP NAME
                                    </Typography>
                                    {/* Central Logo */}
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                        {elements && elements.map((element) => (
                                            <Button
                                                variant="text"
                                                key={element.name}
                                                onClick={() => { element.onClick() }}
                                                sx={{
                                                    my: 2, color: 'white', display: 'block', '&:hover': {
                                                        backgroundColor: '#455a64',
                                                        borderColor: '#455a64'
                                                    },
                                                }}
                                            >
                                                {element.name}
                                            </Button>
                                        ))}
                                    </Box>
                                    {
                                        username &&
                                        <Box sx={{ flexGrow: 0 }}>
                                            <Tooltip title="Open User Info">
                                                <Button
                                                    onClick={handleOpenUserMenu}
                                                    sx={{
                                                        my: 2, color: 'white', '&:hover': {
                                                            backgroundColor: '#455a64',
                                                            borderColor: '#455a64'
                                                        },
                                                    }}
                                                    endIcon={<AccountCircle />}
                                                >
                                                    {username}
                                                </Button>
                                            </Tooltip>
                                            <Menu
                                                sx={{ mt: '45px' }}
                                                id="menu-appbar"
                                                anchorEl={anchorElUser}
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={Boolean(anchorElUser)}
                                                onClose={handleCloseUserMenu}
                                            >
                                                {onUserSettingSelected && userSettings && userSettings.map((setting) => (
                                                    <MenuItem key={setting.id} onClick={() => onUserSettingSelected(setting)}>
                                                        <Typography textAlign="center">{setting.name}</Typography>
                                                    </MenuItem>
                                                ))}
                                            </Menu>
                                        </Box>
                                    }
                                </>
                        }



                    </Toolbar>
                </Container>
            </AppBar>
            <div className="navbar-space" />
        </>
    );
};





export default Navbar;
