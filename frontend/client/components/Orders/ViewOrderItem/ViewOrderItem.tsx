import React from "react";
import { Order } from "../../../../shared/data";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import GroupsIcon from '@mui/icons-material/Groups';
import { OrderStatus } from "../../../../shared/data";
import Badge from '@mui/material/Badge';

interface ViewOrderItemProps {
    order: Order;
    onUpdateOrderClick: (order: Order) => void;
}

const ViewOrderItem: React.FC<ViewOrderItemProps> = ({ order, onUpdateOrderClick }) => {

    const toServeItems = order.items.filter(i => i.status === OrderStatus.ToServe);
    const preparingItems = order.items.filter(i => i.status === OrderStatus.Preparing);
    return (
        <div style={
            {
                margin: '10px',
                display: "flex",
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignContent: 'center',
                justifyContent: 'space-around'
            }}>
            <Badge badgeContent={toServeItems.length} color="error">
                <Card sx={{ minWidth: 256 }} variant="outlined">
                    <CardContent>
                        {/* Order Info */}
                        <Typography variant="h5" component="div" sx={{ mb: 1.5 }} align="center">
                            {order.tableNumber}<TableRestaurantIcon />
                        </Typography>
                        <Typography color="text.secondary">
                            {order.peopleNumber} <GroupsIcon />
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={() => onUpdateOrderClick(order)}>Update</Button>
                    </CardActions>
                </Card>
            </Badge>
        </div>

    );
}

export default ViewOrderItem;