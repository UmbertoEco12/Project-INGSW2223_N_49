import React from "react";
import { Order, OrderItem, OrderStatus } from "../../../shared/data";
import { handleUpdateItemOrderStatus } from "../../helper/userRequestHandler";
import { NavigateFunction } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import ChefOrdersTable from "../../components/ChefOrdersTable/ChefOrdersTable";
interface ChefOrdersPageProps {
    orders: Order[];
    navigate: NavigateFunction;
}

const ChefOrdersPage: React.FC<ChefOrdersPageProps> = ({ orders, navigate }) => {
    const changeItemStatus = (orderItemId: number, status: OrderStatus) => {
        // show an alert for to serve?
        handleUpdateItemOrderStatus(orderItemId, status, navigate).execute();
    }
    return (
        <>
            <Typography variant="h5" textAlign={'center'} gutterBottom>Orders</Typography>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center'
            }}>
                <Box sx={{
                    width: '100%',
                    maxWidth: '1000px'
                }}>
                    <ChefOrdersTable orders={orders} setStatus={changeItemStatus} />
                </Box>
            </div>
        </>
    );
}

export default ChefOrdersPage;