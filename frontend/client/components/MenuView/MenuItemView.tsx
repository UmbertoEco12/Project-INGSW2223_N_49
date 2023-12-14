import React from "react";
import { MenuItem } from "../../../shared/data";
import { Paper, Typography, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import the Fab icon

interface MenuItemViewProps {
    menuItem: MenuItem;
    onSelect?: () => void;
}

const MenuItemView: React.FC<MenuItemViewProps> = ({ menuItem, onSelect }) => {
    return (
        <Paper elevation={1} sx={{ padding: '10px', mb: '10px', position: 'relative' }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "left" }}>
                    <Typography variant="h5" component="a" fontSize={'1.3rem'}>
                        {menuItem.name}
                    </Typography>
                    {menuItem.foreignName !== "" && (
                        <Typography sx={{ fontStyle: "italic" }} variant="h5" component="a" fontSize={'1.3rem'}>
                            /{menuItem.foreignName}
                        </Typography>
                    )}
                </div>
                <div style={{ textAlign: "right" }}>
                    <Typography>${menuItem.price.toFixed(2)}</Typography>
                </div>
            </div>

            {/* Container for description, foreign description, and allergens */}
            <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography variant="h6" component="a" fontSize={'1rem'}>
                        {menuItem.description}
                    </Typography>
                    {menuItem.foreignDescription !== "" && (
                        <Typography sx={{ fontStyle: "italic" }} variant="h6" component="a" fontSize={'1rem'}>
                            <br />{menuItem.foreignDescription}
                        </Typography>
                    )}
                    <Typography align="left" fontSize={'1rem'}>{menuItem.allergens.join(", ")}</Typography>
                </div>
                {
                    onSelect &&
                    <Fab color="primary" size="medium" style={{ alignSelf: 'flex-end', marginTop: '10px' }} onClick={onSelect}>
                        <AddIcon />
                    </Fab>
                }
                {/* Fab component */}

            </div>
        </Paper>
    );
};

export default MenuItemView;
