import React, { useState } from "react";
import { Order, OrderItem, OrderStatus } from "../../../shared/data";
import { handleDeleteOrder, handleUpdateItemOrderStatus } from "../../helper/userRequestHandler";
import { NavigateFunction } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import ManagerCashView from "../../components/ManagerCashView/ManagerCashView";
import AlertDialog from "../../components/Generic/AlertDialog/AlertDialog";

interface ManagerOrdersPageProps {
    orders: Order[];
    navigate: NavigateFunction;
}

const ManagerOrdersPage: React.FC<ManagerOrdersPageProps> = ({ orders, navigate }) => {
    // alert 
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>('');
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    const deleteOrder = (order: Order) => {
        setAlertText(`Are you sure you want to close the active order for Table ${order.tableNumber}?`);
        setOrderToDelete(order);
        setIsAlertOpen(true);
    }

    const closeOrder = () => {
        if (orderToDelete) {
            // delete order
            handleDeleteOrder(orderToDelete.id, navigate).execute();
        }
    }
    return (
        <>
            <Typography variant="h5" textAlign={'center'} gutterBottom>Orders</Typography>
            <ManagerCashView orders={orders} closeOrder={deleteOrder} />
            <AlertDialog
                open={isAlertOpen}
                title='Close Order'
                text={alertText}
                onYesClicked={closeOrder}
                onClose={() => setIsAlertOpen(false)} />
        </>
    );
}

export default ManagerOrdersPage;