import React, { useEffect, useState } from "react";
import { Category, MenuItem, Order, OrderItem, OrderStatus } from "../../../../shared/data";
import { OrderItemCreation } from "../../../../shared/userRequests";
import MenuSelect from "../../../components/MenuView/MenuSelect";
import { handleUpdateOrder } from "../../../helper/userRequestHandler";
import { NavigateFunction, useParams, Route, Routes } from "react-router-dom";
import UpdateOrderView from "./UpdateOrderView";
import { useIsUnsaved } from "../../../helper/reactCustomHooks";
import LoadingView from "../../../components/Generic/LoadingView/LoadingView";
interface UpdateOrderPageProps {
    orders: Order[];
    menuItems: MenuItem[];
    categories: Category[];
    navigate: NavigateFunction
}

const UpdateOrderPage: React.FC<UpdateOrderPageProps> = ({ orders, menuItems, categories, navigate }) => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const onBackClick = () => {
        navigate('/home/orders');
    }
    // get item
    useEffect(() => {
        if (orders && id && order === null) {
            const item = orders.find((it) => it.id.toString() == id);
            if (item) {
                if (order === null) {
                    // update only if null
                    setOrder(item);
                    setStartingItems(item.items);
                    setAllItems(item.items);
                }
            }
            else
                onBackClick(); // go back
        }
    }, [id, orders]);
    const onBackCheck = () => {
        if (!isUnsaved.current && !isUnsaved1.current)
            onBackClick(); // Go back
        else {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?'))
                onBackClick();
        }
    }
    const [startingItems, setStartingItems] = useState<OrderItem[]>(Array.from(order ? order.items : []));
    const [allItems, setAllItems] = useState<OrderItemCreation[]>(Array.from(order ? order.items : []));
    const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
    const isUnsaved = useIsUnsaved<OrderItem[]>(
        (startingItems: OrderItem[]) => JSON.stringify(startingItems) != JSON.stringify(order ? order.items : []),
        startingItems);
    const isUnsaved1 = useIsUnsaved<OrderItemCreation[]>(
        (allItems: OrderItemCreation[]) => JSON.stringify(allItems) != JSON.stringify(order ? order.items : []),
        allItems);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        // update starting items status.
        // update only status since is the only thing that can be updated
        if (order) {
            setStartingItems((prev) => prev.map((item, index) => {
                item.status = order.items[index].status;
                return item;
            }));
        }
    }, [order]);

    const onItemSelect = (item: MenuItem) => {
        //add item
        let newItems = allItems;
        const status = item.readyToServe ? OrderStatus.ToServe : OrderStatus.ToPrepare;
        newItems.push({
            itemId: item.id,
            preparationChoices: item.choices.map((choices, index) => choices.choices[0]), // default selected
            customChanges: [],
            ingredientsRemoved: [],
            orderGroupId: selectedGroupId,
            status: status,
            notes: "",
        });
        setAllItems(newItems);
        navigate(`edit/${id}`);
    }

    const updateOrder = () => {

        if (order) {
            setIsLoading(true);
            handleUpdateOrder(order.id, { updates: startingItems, creations: allItems.filter((_, index) => index >= startingItems.length) }, navigate)
                .onExecute(() => {
                    onBackClick();
                    setIsLoading(false);
                })
                .execute();
        }

    }
    const onAddToGroup = (groupId: number) => {
        navigate(`edit/${id}/select`);
        setSelectedGroupId(groupId);
    }


    return (
        <>
            <LoadingView isOpen={isLoading} />
            {
                order &&
                <>
                    <Routes>
                        <Route path="/" element={
                            <UpdateOrderView
                                order={order}
                                menuItems={menuItems}
                                categories={categories}
                                onBackClick={onBackCheck}
                                startingItems={startingItems} setStartingItems={setStartingItems}
                                allItems={allItems} setAllItems={setAllItems}
                                onAddToGroupClick={onAddToGroup}
                                onUpdateClick={updateOrder}
                            />
                        }></Route>
                        <Route path="/select" element={
                            <MenuSelect
                                categories={categories}
                                items={menuItems}
                                onSelect={onItemSelect}
                                onBackClick={() => navigate(`/home/orders/edit/${id}`)}
                            />
                        }></Route>
                    </Routes>
                </>
            }

        </>
    );
}

export default UpdateOrderPage;