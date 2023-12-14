import { Button } from "@mui/material";
import React from "react";
import { MenuItem } from "../../../../shared/data";
import { NavigateFunction } from "react-router-dom";

interface MenuEditCreateProps {
    menuItems: MenuItem[];
    navigate: NavigateFunction;
    addExisting: () => void;
    canAddExisting: boolean;
}

const MenuEditCreate: React.FC<MenuEditCreateProps> = ({ menuItems, navigate, addExisting, canAddExisting }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '10px',
            marginTop: '10px',
            height: '100%'
        }}>
            <Button variant="outlined" sx={{ marginRight: '10px', padding: '10px', }} fullWidth onClick={() => navigate('/home/menu/create')}>
                Create new
            </Button>
            <Button variant="outlined" sx={{ marginLeft: '10px', padding: '10px', }} fullWidth onClick={addExisting} disabled={!canAddExisting}>
                Add existing
            </Button>
        </div>
    )
}

export default MenuEditCreate;