import React, { useState, useRef, useEffect } from "react";
import { CreateOrderRequest } from "../../../../shared/userRequests";
import { Category, MenuItem, OrderStatus } from "../../../../shared/data";
import MenuSelect from "../../../components/MenuView/MenuSelect";
import { NavigateFunction, Route, Routes } from "react-router-dom";

import { useFormEvents, useIsUnsaved } from "../../../helper/reactCustomHooks";
import CreateOrderView, { CreateOrderViewErrors } from "./CreateOrderView";
import { handleCreateOrder } from "../../../helper/userRequestHandler";
import LoadingView from "../../../components/Generic/LoadingView/LoadingView";
interface CreateOrderPageProps {
    items: MenuItem[];
    categories: Category[];
    navigate: NavigateFunction;
}

const startRequestFrom = { tableNumber: 0, peopleNumber: 0, items: [] };
const noErrors: CreateOrderViewErrors = {
    tableError: null, peopleError: null, noItemsError: null
}
const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ items, categories, navigate }) => {
    const onBackClick = () => {
        navigate('/home/orders');
    }
    const onBackCheck = () => {
        if (!isUnsaved.current)
            onBackClick(); // Go back
        else {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?'))
                onBackClick();
        }
    }
    const [requestForm, setRequestForm] = useState<CreateOrderRequest>(startRequestFrom);
    const [selectedGroupId, setSelectedGroupId] = useState<number>(1);
    const [viewError, setViewError] = useState<CreateOrderViewErrors>(noErrors)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isUnsaved = useIsUnsaved<CreateOrderRequest>(
        (requestForm: CreateOrderRequest) => requestForm != startRequestFrom,
        requestForm);
    const onItemSelect = (item: MenuItem) => {
        // gop back to the create 
        navigate('/home/orders/create');
        // add item
        let newItems = requestForm.items;
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
        setRequestForm(prev => ({ ...prev, items: newItems }));
    }

    const onAddToGroup = (id: number) => {
        setSelectedGroupId(id);
        navigate('create/select');
    }
    const createOrder = () => {
        //reset errors
        setViewError(noErrors);
        if (requestForm.peopleNumber <= 0) {
            setViewError(prev => ({
                ...prev,
                peopleError: 'invalid number'
            }))
            return;
        }
        else if (requestForm.items.length == 0) {
            setViewError(prev => ({
                ...prev,
                noItemsError: 'no Items added'
            }))
            return;
        }
        // lock edit
        setIsLoading(true);
        // on success go to view
        handleCreateOrder(requestForm, navigate)
            .onExecute((order) => {
                // go to view
                navigate("/home/orders");
                setIsLoading(false);
            })
            .execute();
    }
    const [handleInputChange, onSubmit] = useFormEvents(setRequestForm, () => { });
    return (
        <>
            <LoadingView isOpen={isLoading} />
            <Routes>
                <Route path="/" element={
                    <CreateOrderView
                        order={requestForm}
                        setOrder={setRequestForm}
                        onBackClick={onBackCheck}
                        handleInputChange={handleInputChange}
                        menuItems={items}
                        onAddToGroupClick={onAddToGroup}
                        createOrder={createOrder}
                        errors={viewError}
                    />
                }></Route>
                <Route path="/select" element={
                    <MenuSelect
                        categories={categories}
                        items={items}
                        onSelect={onItemSelect}
                        onBackClick={() => navigate('/home/orders/create')}
                    />
                }></Route>
            </Routes>

        </>
    );
}

export default CreateOrderPage;