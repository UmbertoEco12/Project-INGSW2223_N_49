import React, { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../user';
import { NavigateFunction } from 'react-router-dom';
import { handleGetOrders } from '../userRequestHandler';
import { subscribeToOrder, unsubscribeFromOrder } from '../webSocketHandler';
import { Order } from '../../../shared/data';

interface AddOrderTopicMessage {
    message: string;
    item: Order;
}
interface DeleteOrderTopicMessage {
    message: string;
    id: number;
}
export function useOrders(navigate: NavigateFunction): [Order[], React.Dispatch<React.SetStateAction<Order[]>>] {
    const [orders, setOrders] = useState<Order[]>([]);
    const parseMessage = (message: any) => {
        if (message.message === 'add') {
            const msg = message as AddOrderTopicMessage;
            if (orders.find(i => msg.item.id == i.id)) {
                // update order if the create updated an existing order.
                setOrders(prev => prev.map(i => i.id == msg.item.id ? msg.item : i));
            }
            else {
                setOrders(prev => [...prev, msg.item]);
            }

        }
        else if (message.message === 'delete') {
            const msg = message as DeleteOrderTopicMessage;
            setOrders(prev => prev.filter((item) => {
                return item.id !== msg.id;
            }));
        }
        else if (message.message === 'update') {
            const msg = message as AddOrderTopicMessage;
            setOrders(prev => prev.map((item) => {
                if (item.id === msg.item.id) {
                    return msg.item;
                }
                return item;
            }));
        }
        else {
            console.log('unmanaged topic message:', message);
        }
    }
    useEffect(() => {
        let ignore = false;
        const user = getAuthenticatedUser();
        if (user !== null) {
            handleGetOrders(navigate)
                .onExecute((response) => {
                    if (!ignore) {
                        setOrders(response);
                    }
                })
                .execute();
            subscribeToOrder(parseMessage);
        }
        return () => {
            ignore = true;
            unsubscribeFromOrder(parseMessage);
        };
    }, [navigate]);

    return [orders, setOrders];
}