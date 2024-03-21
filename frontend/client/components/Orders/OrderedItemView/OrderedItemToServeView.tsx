import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, Button, TextField, Chip, Divider, Grid, Paper } from '@mui/material';
import { OrderItem, MenuItem, OrderStatus } from '../../../../shared/data';
import CheckIcon from '@mui/icons-material/Check';
import { customChangesColor, getOrderStatusColor, ingredientsRemovedColor, preparationChoicesColor } from '../../../helper/themeManager';
import OrderItemChoices from '../OrderItemChoices/OrderItemChoices';

interface OrderedItemToServeViewProps {
    itemStatus: OrderStatus;
    item?: OrderItem;
    menuItem: MenuItem;
    setStatus: (status: string) => void;
}

const OrderedItemToServeView: React.FC<OrderedItemToServeViewProps> = ({ itemStatus, item, menuItem, setStatus }) => {
    return (
        <Paper elevation={1} sx={{ mb: '2px', ml: '10px', mr: '10px' }}>
            <Grid container spacing={1} sx={{ display: 'flex', alignItems: 'center' }}>
                {
                    itemStatus == OrderStatus.ToServe &&
                    <Grid item xs={2}>
                        <>
                            <IconButton color='success' onClick={(e) => {
                                e.stopPropagation();
                                setStatus(OrderStatus.Served);
                            }} >
                                <CheckIcon />
                            </IconButton>
                            <Divider orientation="vertical" flexItem variant="middle" sx={{
                                mr: '10px',
                                ml: '10px'
                            }} />
                        </>
                    </Grid>
                }

                <Grid item xs={10}>
                    <Typography align={'left'} color={getOrderStatusColor(itemStatus)} >
                        {menuItem.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ padding: '10px', ml: '10px', mr: '10px' }}>
                    {
                        item &&
                        <>
                            <OrderItemChoices item={item} />
                        </>
                    }
                </Grid>



            </Grid>
        </Paper>
    )
}

export default OrderedItemToServeView;