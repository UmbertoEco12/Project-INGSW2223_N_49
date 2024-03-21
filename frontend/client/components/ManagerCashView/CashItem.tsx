import React from 'react';
import { Order } from '../../../shared/data';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import Grid from '@mui/material/Grid';
import GroupsIcon from '@mui/icons-material/Groups';
import OrderItemChoices from '../Orders/OrderItemChoices/OrderItemChoices';
interface CashItemProps {
    order: Order;
    closeOrder: (order: Order) => void;
}

const CashItem: React.FC<CashItemProps> = ({ order, closeOrder }) => {
    return (
        <Card sx={{ margin: '10px', width: 400, height: 'fit-content' }}>
            <CardContent>
                <Typography sx={{ fontSize: 18 }} color="text" gutterBottom>
                    Total: ${order.items.reduce((total, curr) => total + curr.itemPrice, 0).toFixed(2)}
                </Typography>
                <Typography variant="h5" component="div" textAlign={'center'}>
                    <TableRestaurantIcon />{order.tableNumber} <GroupsIcon />{order.peopleNumber}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Items
                </Typography>
                {
                    order.items.map((item, index) => (
                        <Grid key={item.orderItemId} container spacing={2}>
                            <Grid item xs={10} textAlign={'left'}>
                                <Typography textAlign={'left'}
                                    color={item.isCanceled ? 'error' : 'text'}
                                    sx={{
                                        textDecorationLine: item.isCanceled ? 'line-through' : ''
                                    }}>{item.itemName} </Typography>

                                {
                                    item.isCanceled &&
                                    <Typography textAlign={'left'} color={'text'}>
                                        {item.status}
                                    </Typography>
                                }

                                <OrderItemChoices item={item} />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography textAlign={'right'}>${item.itemPrice.toFixed(2)}</Typography>
                            </Grid>
                        </Grid>
                    ))
                }
            </CardContent>
            <CardActions>
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <Button variant='contained' color='error' onClick={() => closeOrder(order)}> Close</Button>
                </div>

            </CardActions>
        </Card>
    )
}

export default CashItem;