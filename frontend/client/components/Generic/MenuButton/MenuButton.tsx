import React, { useState } from 'react';
import { MenuItem, Menu, Button, Tooltip } from '@mui/material';
import { HasNameAndId } from '../../../helper/helperInterfaces';
interface MenuButtonProps {
    tooltip: string;
    items: HasNameAndId[];
    text: string;
    variant?: 'text' | 'outlined' | 'contained'
    onItemClick: (item: HasNameAndId) => void;
}
const MenuButton: React.FC<MenuButtonProps> = ({ tooltip, items, text, onItemClick, variant = 'text' }) => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    }
    return (
        <>
            <Tooltip title={tooltip}>
                <Button
                    variant={variant}
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    style={{ textTransform: 'none' }}
                    onClick={handleOpenMenu}>{text}</Button>
            </Tooltip>

            <Menu
                id="menu-appbar"
                anchorEl={menuAnchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
            >
                {
                    items.map(item => (
                        <MenuItem
                            key={item.id}
                            onClick={() => {
                                onItemClick(item);
                                handleCloseMenu();
                            }}>
                            {item.name}</MenuItem>
                    ))
                }
            </Menu>
        </>
    )
}

export default MenuButton;