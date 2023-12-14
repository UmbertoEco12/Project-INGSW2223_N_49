import React, { useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../user';
import { NavigateFunction } from 'react-router-dom';
import { handleGetMenuItems } from '../userRequestHandler';
import { subscribeToMenuItem, unsubscribeFromMenuItem } from '../webSocketHandler';
import { ItemUpdateCategoryOrder } from '../../../shared/userRequests';
import { MenuItem } from '../../../shared/data';


interface AddMenuItemTopicMessage {
    message: string;
    item: MenuItem;
}
interface DeleteMenuItemTopicMessage {
    message: string;
    id: number;
}

interface ReorderMenuItemTopicMessage {
    message: string;
    categoryId: number;
    items: ItemUpdateCategoryOrder[]
}

export function useMenuItems(navigate: NavigateFunction): [MenuItem[], React.Dispatch<React.SetStateAction<MenuItem[]>>] {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    const parseMessage = (message: any) => {
        if (message.message === 'add') {
            const msg = message as AddMenuItemTopicMessage;
            setMenuItems(prevMenuItems => [...prevMenuItems, msg.item]);
        }
        else if (message.message === 'delete') {
            const msg = message as DeleteMenuItemTopicMessage;
            setMenuItems(prevMenuItems => prevMenuItems.filter((item) => {
                return item.id !== msg.id;
            }));
        }
        else if (message.message === 'update') {
            const msg = message as AddMenuItemTopicMessage;
            setMenuItems(prevMenuItems => prevMenuItems.map((item) => {
                if (item.id === msg.item.id) {
                    return msg.item;
                }
                return item;
            }));
        }
        else if (message.message === 'reorder') {
            const msg = message as ReorderMenuItemTopicMessage;
            setMenuItems(prevMenuItems => prevMenuItems.map((item) => {
                for (let i = 0; i < msg.items.length; i++) {
                    if (item.id === msg.items[i].itemId) {
                        // update existing order
                        for (let j = 0; j < item.categories.length; j++) {
                            if (item.categories[j].categoryId === msg.categoryId) {
                                item.categories[j].itemOrder = msg.items[i].itemOrder;
                                return item;
                            }
                        }
                        // if not found add new order
                        item.categories.push({ categoryId: msg.categoryId, itemOrder: msg.items[i].itemOrder });
                        return item;
                    }
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
            handleGetMenuItems(navigate)
                .onExecute((response) => {
                    if (!ignore) {
                        setMenuItems(response);
                    }
                })
                .execute();
            subscribeToMenuItem(parseMessage);
        }
        return () => {
            ignore = true;
            unsubscribeFromMenuItem(parseMessage);
        };
    }, [navigate])

    return [menuItems, setMenuItems];
}