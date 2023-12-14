import React, { useState } from 'react';
import { Order, OrderItem, OrderStatus } from '../../../shared/data';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography, TextField } from '@mui/material';
import MenuButton from '../Generic/MenuButton/MenuButton';
import OrderItemChoices from '../Orders/OrderItemChoices/OrderItemChoices';
import { getOrderStatusColor } from '../../helper/themeManager';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
interface ChefOrdersTableProps {
    orders: Order[];
    setStatus: (orderItemId: number, status: OrderStatus) => void;
}

interface OrderItemWithTable extends OrderItem {
    tableNumber: number;
}

const ChefOrdersTable: React.FC<ChefOrdersTableProps> = ({ orders, setStatus }) => {
    const [filteredStatus, setFilteredStatus] = useState<string>('status');
    const [filteredTable, setFilteredTable] = useState<string>('Table');
    const [canceledItemsToIgnore, setCanceledItemsToIgnore] = useState<number[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');

    // change filtered staff
    const allOrderItems: OrderItemWithTable[] = orders.flatMap(order =>
        order.items
            .filter(
                (item, index) =>
                    item.status === OrderStatus.ToPrepare ||
                    item.status === OrderStatus.Preparing ||
                    item.status === OrderStatus.Waiting
            )
            .map(item => ({ ...item, tableNumber: order.tableNumber }))
    ).filter((i) => i.itemName.includes(searchValue)
    ).sort((a, b) => a.tableNumber - b.tableNumber);

    const tables: number[] = [...new Set(allOrderItems.map((item) => item.tableNumber))];

    const filteredItems = allOrderItems.filter((item) => {
        const isTableMatch = filteredTable !== 'Table' ? item.tableNumber === Number(filteredTable) : true;
        const isStatusMatch = filteredStatus !== 'status' ? (item.status === filteredStatus && !item.isCanceled) : true;

        return isTableMatch && isStatusMatch;
    });
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                display: 'flex',
                                alignItems: 'center',
                                minHeight: '36.500px'
                            }}>
                                <Typography component={'a'} >Name</Typography>
                                <TextField style={{ margin: 0, marginLeft: '10px' }} placeholder='Search name' type='search' variant='standard' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}></TextField>
                            </TableCell>
                            <TableCell align='center'>
                                <MenuButton
                                    text={(filteredTable.charAt(0).toUpperCase() + filteredTable.slice(1).toLowerCase()).replace('_', '')}
                                    tooltip={'Filter by table'}
                                    items={[{ id: 0, name: 'Table' }, ...tables.map((n) => ({ id: n, name: n.toString() }))]}
                                    onItemClick={(item) => {
                                        setFilteredTable(item.name);
                                    }}
                                />
                            </TableCell>

                            <TableCell align="right">
                                <MenuButton
                                    text={filteredStatus.charAt(0).toUpperCase() + filteredStatus.slice(1).toLowerCase()}
                                    tooltip={'Filter by status'}
                                    items={[{ id: 0, name: 'Status' }, { id: 1, name: 'To Prepare' }, { id: 2, name: 'Preparing' }, { id: 3, name: 'Waiting' }]}
                                    onItemClick={(item) => {
                                        const roles = ['status', OrderStatus.ToPrepare, OrderStatus.Preparing, OrderStatus.Waiting]
                                        setFilteredStatus(roles[item.id]);
                                    }}
                                />
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredItems.length > 0 ?
                                <>
                                    {
                                        filteredItems.map((item, index) => (
                                            !(item.isCanceled && canceledItemsToIgnore.includes(item.orderItemId)) &&
                                            <TableRow
                                                key={item.orderItemId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Typography color={item.isCanceled ? 'red' : getOrderStatusColor(item.status as OrderStatus)} textAlign={'left'} gutterBottom sx={{
                                                        textDecoration: item.isCanceled ? 'line-through' : ''
                                                    }}>
                                                        {item.itemName}
                                                    </Typography>
                                                    <OrderItemChoices item={item} />
                                                    <Typography textAlign={'left'} gutterBottom >
                                                        {item.notes}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography>
                                                        <TableRestaurantIcon />{item.tableNumber}
                                                    </Typography>

                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        item.isCanceled ?
                                                            <>
                                                                <Button variant='contained' color='error'
                                                                    onClick={() => {
                                                                        setCanceledItemsToIgnore(prev => ([
                                                                            ...prev, item.orderItemId
                                                                        ]));
                                                                    }}>
                                                                    Ignore
                                                                </Button>
                                                            </>
                                                            :
                                                            <>
                                                                {
                                                                    item.status != OrderStatus.Waiting ?
                                                                        <Button variant='contained' sx={{
                                                                            backgroundColor: getOrderStatusColor(item.status as OrderStatus)
                                                                        }}
                                                                            onClick={() => {
                                                                                setStatus(item.orderItemId, item.status == OrderStatus.ToPrepare ? OrderStatus.Preparing : OrderStatus.ToServe);
                                                                            }}>
                                                                            {
                                                                                item.status == OrderStatus.ToPrepare ?
                                                                                    'Start Preparing'
                                                                                    :
                                                                                    'Complete'
                                                                            }
                                                                        </Button>
                                                                        :
                                                                        <Typography>
                                                                            Wait
                                                                        </Typography>
                                                                }
                                                            </>
                                                    }

                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </>
                                :
                                <>
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" width={'100%'} align='center'>
                                            No Orders
                                        </TableCell>
                                    </TableRow>
                                </>
                        }
                    </TableBody>
                </Table>
            </TableContainer >
        </>
    );
}

export default ChefOrdersTable;