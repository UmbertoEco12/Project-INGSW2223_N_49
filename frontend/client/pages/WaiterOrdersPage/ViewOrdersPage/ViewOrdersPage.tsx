import React from "react";
import { Order } from "../../../../shared/data";
import { Button } from "@mui/material";
import ViewOrderItem from "../../../components/Orders/ViewOrderItem/ViewOrderItem";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography'
interface ViewOrdersPageProps {
    orders: Order[];
    onUpdateOrderClick: (order: Order) => void;
    onCreateOrderClick: () => void;
}

const ViewOrdersPage: React.FC<ViewOrdersPageProps> = ({ orders, onUpdateOrderClick, onCreateOrderClick }) => {
    return (
        <>
            {
                (orders && orders.length > 0) ?
                    (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {
                                orders.map((order) => (
                                    <ViewOrderItem key={order.id} order={order} onUpdateOrderClick={onUpdateOrderClick} />
                                ))
                            }
                        </div>
                    )
                    : (
                        <>
                            <Typography variant='h3' textAlign={'center'} sx={{ margin: '10px' }} color={'text.secondary'}>No Orders</Typography>
                        </>
                    )
            }
            <Fab color="primary" aria-label="add" onClick={onCreateOrderClick} sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
            }}>
                <AddIcon />
            </Fab>
        </>
    );
}

export default ViewOrdersPage;