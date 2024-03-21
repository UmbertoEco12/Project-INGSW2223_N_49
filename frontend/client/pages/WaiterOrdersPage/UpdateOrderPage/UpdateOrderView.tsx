import React, { } from "react";
import { Category, MenuItem, Order, OrderItem, OrderStatus } from "../../../../shared/data";
import ItemOrderCreationGroups from "../../../components/Orders/ItemOrderCreationGroups/ItemOrderCreationGroups";
import { OrderItemCreation } from "../../../../shared/userRequests";
import TitleAndBack from "../../../components/Generic/TitleAndBack/TitleAndBack";
import OrderedItemCreateView from "../../../components/Orders/OrderedItemView/OrderedItemCreateView";
import OrderedItemUpdateView from "../../../components/Orders/OrderedItemView/OrderedItemUpdateView";
import { Button, Typography } from "@mui/material";
import OrderedItemToServeView from "../../../components/Orders/OrderedItemView/OrderedItemToServeView";
import { servedStatusColor } from "../../../helper/themeManager";
interface UpdateOrderViewProps {
    order: Order;
    menuItems: MenuItem[];
    categories: Category[];
    onBackClick: () => void;
    startingItems: OrderItem[];
    allItems: OrderItemCreation[];
    setStartingItems: (startingItems: OrderItem[]) => void;
    setAllItems: (allItems: OrderItemCreation[]) => void;
    onAddToGroupClick: (id: number) => void;
    onUpdateClick: () => void;
}

const UpdateOrderView: React.FC<UpdateOrderViewProps> = ({ order, menuItems, categories, onBackClick, startingItems, allItems, setStartingItems, setAllItems, onAddToGroupClick, onUpdateClick }) => {
    const moveItem = (newId: number, itemIndex: number, curr: number) => {
        if (itemIndex >= startingItems.length) {
            //update created items
            setAllItems(allItems.map((i, index) => {
                if (index === itemIndex) {
                    i.orderGroupId = newId;
                    return i;
                }
                return i;
            }))
        }
        else {
            // update starting items
            setStartingItems(startingItems.map((i, index) => {
                if (index === itemIndex) {
                    i.orderGroupId = newId;
                    return i;
                }
                return i;
            }))
        }
    }
    return (
        <>
            <>
                <TitleAndBack title={`Edit Order ${order.tableNumber}`} onBackClick={onBackClick} />
                {/* Print to serve items first */}
                {
                    allItems.map((_, index) => {
                        if (index < startingItems.length) {
                            const item = startingItems[index];
                            if ([OrderStatus.ToServe].includes(item.status as OrderStatus))
                                return <OrderedItemToServeView
                                    key={index}
                                    itemStatus={item.status as OrderStatus}
                                    item={item}
                                    menuItem={menuItems.find(i => i.id == item.itemId) as MenuItem}
                                    setStatus={(status) => setStartingItems(startingItems.map((it, i) => i == index ? { ...it, status: status } : it))} />
                            else return null;
                        }
                    })
                }
                {/* Show groups */}
                <ItemOrderCreationGroups
                    skipItem={(item, index) => {
                        if (OrderStatus.Served == item.status || (index < startingItems.length && OrderStatus.ToServe == item.status))
                            return true;
                        return false;
                    }}
                    items={allItems} onAddToGroup={onAddToGroupClick} getItemWithIndex={(index, groupId, nextId, prevId, canMoveUp, canMoveDown) => {
                        if (index < startingItems.length) {
                            const item = startingItems[index];
                            // item to be updated
                            return <OrderedItemUpdateView
                                key={index}
                                item={item}
                                setStatus={(status) => setStartingItems(startingItems.map((it, i) => i == index ? { ...it, status: status } : it))}
                                menuItem={menuItems.find(i => i.id == item.itemId) as MenuItem}
                                setNotes={(notes) => setStartingItems(startingItems.map((it, i) => i == index ? { ...it, notes: order.items[index].notes + notes } : it))}
                                startingNotes={order.items[index].notes}
                                onCancelClick={(canceled) => setStartingItems(startingItems.map((it, i) => i == index ? { ...it, isCanceled: canceled } : it))}
                                onMoveUp={canMoveUp ? () => moveItem(prevId, index, groupId) : undefined}
                                onMoveDown={canMoveDown ? () => moveItem(nextId, index, groupId) : undefined}

                            />
                        }
                        else {
                            const item = allItems[index];
                            // item just created
                            return <OrderedItemCreateView
                                key={index}
                                creationItem={item}
                                setCreationItem={(newItem: OrderItemCreation) => {
                                    setAllItems(allItems.map((item, i) => i === index ? newItem : item))
                                }}
                                menuItem={menuItems.find(i => i.id == item.itemId) as MenuItem}
                                onRemoveClick={() =>
                                    setAllItems(allItems.filter((it, i) => i !== index))
                                }
                                onMoveUp={canMoveUp ? () => moveItem(prevId, index, groupId) : undefined}
                                onMoveDown={canMoveDown ? () => moveItem(nextId, index, groupId) : undefined}
                            />
                        }
                    }}
                />
                {/* Print served items last */}
                <Typography variant="h6" width={'100%'} align="left">Served Items</Typography>
                {
                    allItems.map((_, index) => {
                        if (index < startingItems.length) {
                            const item = startingItems[index];
                            if ([OrderStatus.Served].includes(item.status as OrderStatus))
                                return <Typography key={index} align={'left'} color={servedStatusColor}>
                                    {(menuItems.find(i => i.id == item.itemId) as MenuItem).name}
                                </Typography>
                            else return null;
                        }
                        else {
                            const item = allItems[index];
                            if ([OrderStatus.Served].includes(item.status as OrderStatus))
                                return <Typography key={index} align={'left'} color={servedStatusColor}>
                                    {(menuItems.find(i => i.id == item.itemId) as MenuItem).name}
                                </Typography>
                            else return null;
                        }
                    })
                }
                <div style={{
                    textAlign: 'center',
                    width: '100%'
                }}>

                    <Button variant='contained' onClick={onUpdateClick} >Update Order</Button>

                </div>
            </>
        </>
    );
}

export default UpdateOrderView;