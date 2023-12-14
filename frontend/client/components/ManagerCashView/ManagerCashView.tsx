import React, { useState } from 'react';
import { Order } from '../../../shared/data';
import CashItem from './CashItem';
import MenuButton from '../Generic/MenuButton/MenuButton';
import { Divider, Typography } from '@mui/material';

interface ManagerCashViewProps {
    orders: Order[];
    closeOrder: (order: Order) => void;
}

const ManagerCashView: React.FC<ManagerCashViewProps> = ({ orders, closeOrder }) => {
    const [filteredTable, setFilteredTable] = useState<string>('Table');

    const tables: number[] = [...new Set(orders.map((item) => item.tableNumber))];

    const filteredOrders = orders.filter(i => filteredTable != 'Table' ? Number(filteredTable) == i.tableNumber : true);
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Typography sx={{ mr: '4px' }}>
                    Filter
                </Typography>
                <MenuButton
                    variant='outlined'
                    text={(filteredTable.charAt(0).toUpperCase() + filteredTable.slice(1).toLowerCase()).replace('_', '')}
                    tooltip={'Filter by table'}
                    items={[{ id: 0, name: 'Table' }, ...tables.map((n) => ({ id: n, name: n.toString() }))]}
                    onItemClick={(item) => {
                        setFilteredTable(item.name);
                    }}
                />
            </div>
            <Divider></Divider>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {
                    filteredOrders.length > 0 ? filteredOrders.map(order => (
                        <CashItem key={order.id} order={order} closeOrder={closeOrder} />
                    ))
                        :
                        <>
                            <Typography sx={{ width: '100%', mt: '10px' }} color={'text.secondary'}>
                                No open orders
                            </Typography>
                        </>
                }
            </div>

        </>
    )
}

export default ManagerCashView;