import React, { useRef } from "react";
import { CreateOrderRequest, OrderItemCreation } from "../../../../shared/userRequests";
import { MenuItem } from "../../../../shared/data";
import ItemOrderCreationGroups from "../../../components/Orders/ItemOrderCreationGroups/ItemOrderCreationGroups";
import TitleAndBack from "../../../components/Generic/TitleAndBack/TitleAndBack";

import Box from '@mui/material/Box';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import GroupsIcon from '@mui/icons-material/Groups';
import { Grid, Button, Typography } from "@mui/material";
import CustomTextField from "../../../components/Generic/CustomTextField/CustomTextField";
import OrderedItemCreateView from "../../../components/Orders/OrderedItemView/OrderedItemCreateView";
import NumberTextField from "../../../components/Generic/NumberTextField/NumberTextField";
interface CreateOrderViewProps {
    order: CreateOrderRequest;
    setOrder: React.Dispatch<React.SetStateAction<CreateOrderRequest>>
    onBackClick: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    menuItems: MenuItem[];
    onAddToGroupClick: (id: number) => void;
    createOrder: () => void;
    errors?: CreateOrderViewErrors;
}

export interface CreateOrderViewErrors {
    tableError: string | null;
    peopleError: string | null;
    noItemsError: string | null;
}

const CreateOrderView: React.FC<CreateOrderViewProps> = ({ order, setOrder, onBackClick, handleInputChange, menuItems, onAddToGroupClick, createOrder, errors }) => {
    const peopleRef = useRef<HTMLInputElement | null>(null);
    const moveItem = (newId: number, itemIndex: number, curr: number) => {
        setOrder(prev => ({
            ...prev,
            items: prev.items.map((i, index) => {
                if (index === itemIndex) {
                    i.orderGroupId = newId;
                    return i;
                }
                return i;
            })
        }))
    }
    return (
        <>
            <TitleAndBack title="Create Order" onBackClick={onBackClick} />
            <Box sx={{
                border: '2px solid darkgrey',
                borderRadius: '6px',
                width: '80%',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                padding: '24px'
            }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '150px' }}>
                            <TableRestaurantIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <NumberTextField
                                label={"Table Number"} variant={"standard"} type={"number"}
                                onEnterPressed={() => peopleRef.current?.focus()}
                                name="tableNumber"
                                value={order.tableNumber}
                                onChange={handleInputChange}
                                error={errors?.tableError != null}
                                helperText={errors?.tableError}
                                autoFocus
                                allowNegative={false}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '150px' }}>
                            <GroupsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <NumberTextField
                                label="People Number"
                                variant="standard"
                                type="number"
                                inputRef={peopleRef}
                                blurOnEnterPressed
                                name="peopleNumber"
                                value={order.peopleNumber}
                                onChange={handleInputChange}
                                error={errors?.peopleError != null}
                                helperText={errors?.peopleError}
                                allowNegative={false} />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <ItemOrderCreationGroups
                            items={order.items} onAddToGroup={onAddToGroupClick} getItemWithIndex={(index, groupId, nextId, prevId, canMoveUp, canMoveDown) => {
                                const item = order.items[index];
                                return <OrderedItemCreateView
                                    key={index}
                                    creationItem={item}
                                    setCreationItem={(newItem: OrderItemCreation) => {
                                        setOrder(prev => (
                                            {
                                                ...prev,
                                                items: prev.items.map((item, i) => i === index ? newItem : item)
                                            }
                                        ))
                                    }}
                                    menuItem={menuItems.find(i => i.id == item.itemId) as MenuItem}
                                    onRemoveClick={() =>
                                        setOrder((prev) => ({
                                            ...prev,
                                            items: prev.items.filter((it, i) => i !== index),
                                        }))
                                    }
                                    onMoveUp={canMoveUp ? () => moveItem(prevId, index, groupId) : undefined}
                                    onMoveDown={canMoveDown ? () => moveItem(nextId, index, groupId) : undefined}
                                />
                            }} />
                    </Grid>
                </Grid>
                <div style={{
                    textAlign: 'center',
                    width: '100%'
                }}>
                    <Button variant='contained' onClick={createOrder} color={errors?.noItemsError != null ? 'error' : 'primary'}>Create Order</Button>

                </div>
                {
                    errors?.noItemsError != null &&
                    <Typography color={'error'}>{errors.noItemsError}</Typography>
                }
            </Box>
        </>
    );
}

export default CreateOrderView;